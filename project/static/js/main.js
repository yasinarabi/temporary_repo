var INFO_ICON = '<i class="bi bi-info-lg ms-1"></i>';
var EDIT_ICON = '<i class="bi bi-pencil-fill ms-1"></i>';
var NEW_ICON = '<i class="bi bi-plus ms-1"></i>';
var USERS_ICON = '<i class="bi bi-people-fill ms-1"></i>';
var REMOVE_ICON = '<i class="bi bi-x ms-1"></i>';
var MORE_ICON = '<i class="bi bi-three-dots-vertical">';
var ORDER_ICON = '<i class="bi bi-cart-fill">';
var HISTORY_ICON = '<i class="bi bi-clock-history">';
var SEND_ICON = '<i class="bi bi-arrow-bar-up">';
var RECEIVE_ICON = '<i class="bi bi-arrow-bar-down">';
var RETURN_ICON = '<i class="bi bi-arrow-return-right">'
var PROGRESS_ICON = '<i class="bi bi-hourglass-split">'

function toPersianNum(number) {
    if (number == null) {
        return ""
    }
    return ("" + number).replace(/[0-9]/g, function (t) {
        return "٠١٢٣٤٥٦٧٨٩".slice(+t, +t + 1);
    });
}

function redirectOnAjaxError(xhr, status, error) {
  switch (xhr.status) {
    case 403:
      window.location.href = "/403";
      return;
    case 404:
      window.location.href = "/404";
      return;
    case 500:
      window.location.href = "/500";
      return;
    case 503:
      window.location.href = "/503";
      return;
  }
}

$(".sellect-all").on("click", function () {
  $(this)
    .closest(".accordion-body")
    .find("input")
    .prop("checked", $(this).prop("checked"));
});

$(".image-viewer a").on("click", function(){
    $(".image-viewer").addClass("hidden");
})

function openImageViewer(event){
    $.ajax({
        url: `/api/images/${$(event.target).data("id")}/`,
        type: 'GET',
        success: function(data){
            $(".image-viewer img").attr("src", data.original_image);
            $(".image-viewer").removeClass("hidden");
        }
    })
    
}

function getPermissions() {
  return new Promise((resolve, reject) => {
    // Check if permissions are available in localStorage
    const storedPermissions = localStorage.getItem("permissions");

    if (storedPermissions) {
      resolve(JSON.parse(storedPermissions));
    } else {
      // If not, make an AJAX call to get permissions
      fetch("/api/current_user/permissions")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Save permissions to localStorage
          localStorage.setItem("permissions", JSON.stringify(data));
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

// Example usage:
async function has_permission(permissionName) {
  try {
    const permissions = await getPermissions();

    // Check if the requested permission is in the permissions list
    return permissions.some(
      (permission) => permission.codename === permissionName
    );
  } catch (error) {
    console.error("Error fetching or saving permissions:", error);
    return false;
  }
}

async function has_permission_to_app(appName) {
  try {
    const permissions = await getPermissions();

    // Check if the requested app is in the permissions list
    return permissions.some((permission) => permission.app === appName);
  } catch (error) {
    console.error("Error fetching or saving permissions:", error);
    return false;
  }
}

async function has_permission_to_model(modelName) {
  try {
    const permissions = await getPermissions();

    // Check if the requested model is in the permissions list
    return permissions.some((permission) => permission.model === modelName);
  } catch (error) {
    console.error("Error fetching or saving permissions:", error);
    return false;
  }
}

async function get_permissions_of_model(modelName) {
  try {
    const permissions = await getPermissions();

    // Check if the requested model is in the permissions list
    return permissions.filter((permission) => permission.model === modelName);
  } catch (error) {
    console.error("Error fetching or saving permissions:", error);
    return false;
  }
}

function clearPermissions() {
  localStorage.removeItem("permissions");
}

$("#logout").on("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("permissions");
  window.location.href = "/logout/"; // Change to your logout URL
});

function showToast(type, message) {
  if ($.inArray(type, ["danger", "success", "info", "warning"]) === -1) {
    console.error("Invalid toast type.");
    return;
  }
  $(`#toast-body-${type}`).text(message);
  $(`#toast-${type}`).toast("show");
  const audio = new Audio("/static/audio/notification.mp3");
  audio.play();
}

function showUploadToast(){
    $('#progress-bar').css('width', '0%').attr('aria-valuenow', 0).text('0%');
    $(`#toast-upload`).toast("show");
    $("#close-upload").prop("disabled", true);
}

function updateUploadToast(percent){
    $('#progress-bar').css('width', percent + '%').attr('aria-valuenow', percent).text(percent + '%');
}

function completeUploadToast(){
    $('#progress-bar').css('width', '100%').attr('aria-valuenow', 100).text('آپلود موفق');
    $("#close-upload").prop("disabled", false);
    const audio = new Audio("/static/audio/notification.mp3");
    audio.play();
}

function errorUploadToast(message){
    $(`#toast-upload`).toast("hide");
    $(`#toast-danger`).toast("show");
    $(`#toast-body-danger`).text(message);
    const audio = new Audio("/static/audio/notification.mp3");
    audio.play();
}

$('.togglePassword').on('click', function () {
    const eye = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
        </svg>
        `;
    const eye_slash = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
    `;
    const password = $(this).closest('div').find('input');
    if (password.attr('type') === 'password'){
        password.attr('type', 'text');
        $(this).html(eye_slash);
    } else {
        password.attr('type', 'password');
        $(this).html(eye);
    }
});