function autocomplete(inputs, suggestion_list, search_url, select_event, extra_params) {
    inputs.forEach(input => {
        input.on('keyup', function () {
            $.ajax({
                type: "GET",
                url: search_url,
                data: {
                    "phrase": $(this).val(),
                    "key": $(this).data("key"),
                    ...extra_params,
                    },
                headers: { "X-CSRFToken": window.CSRF_TOKEN },
                beforeSend: function () {
                    suggestion_list.empty();
                },
                success: function(data) {
                    console.log(data.data);
                    suggestion_list.empty();
                    $.each(data.data, function (i, item) {
                        if(input.data("key") == "full_name" && item["full_name"] == null){
                            item.full_name = item["first_name"] + " " + item["last_name"]
                        }
                        var li = $("<li class='list-group-item bg-secondary width-100' style='--bs-bg-opacity: .9; cursor: pointer;'>").text(item[input.data("key")]);
                        li.on('click', function () {
                            inputs.forEach(input => {
                                input.val(item[input.data("key")]);
                            });
                            suggestion_list.empty();
                            if (select_event){
                                select_event();
                            }
                        });
                        suggestion_list.append(li);
                    });
                },
                error: function () {
    
                }
            })
        });
    })
}