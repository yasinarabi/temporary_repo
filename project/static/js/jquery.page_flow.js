/*! @preserve
 * jquery.page_flow.js
 * Version: 0.0.1
 * Authors: Yasin Arabi <yasinarabi@gmail.com>
 */

(function ($) {
    var pluginName = "page_flow";
    
    var defaults = {
        count_pages: 1,
        asc_icon: "bi-caret-down-fill",
        desc_icon: "bi-caret-up-fill",
        first_icon: '<i class="bi bi-chevron-double-right"></i>',
        prev_icon: '<i class="bi bi-chevron-right"></i>',
        next_icon: '<i class="bi bi-chevron-left"></i>',
        last_icon: '<i class="bi bi-chevron-double-left"></i>',
        list_icon: '<i class="bi bi-list-ul">',
        filter_icon: '<i class="bi bi-funnel-fill">',
        order_selector: "thead th",
        per_page_values: [10, 20, 50, 100, 200]
    };

    var templates = {
        filter_input_group: `
        <div class="input-group">
            <label class="form-label my-auto mx-2" for="filter-input"></label>
            <input class="form-control" id="filter-input">
        </div>
        `,
        filter_form_select_group: `
        <div class="input-group">
            <label class="form-label my-auto mx-2" for="filter-input"></label>
            <select class="form-select"></select>
        </div>
        `,
        filter_bool_input_group: `
        <div class="input-group mt-2 mx-3">
            <label class="form-check-label my-auto mx-2" for="filter-input"></label>
            <input class="form-check-input" type="checkbox" data-type="checkbox">
        </div>
        `,
        pagination_container: '<div class="d-flex flex-wrap justify-content-center">',
        count_items: '<div class="pt-1 px-5 my-1">',
        pagination: '<div class="pf-pagination">',
        pagination_input_group: '<div class="input-group page-size-select-group mx-5">',
        pagination_input_label: '<label class="input-group-text">',
        pagination_select: '<select class="form-select form-select-sm page-size-select" aria-label="Page Size">',
        filter_container: '<div class="d-flex flex-wrap justify-content-right">',
        filter_select_group: '<div class="input-group page-size-select-group">',
        filter_select_label: '<label class="input-group-text">',
        filters_select: '<select class="form-select form-select-sm filter-select" aria-label="Page Size">',
        filters_select_none_option: '<option value="none" selected>فیلتر بر اساس</option>',
        filter_range: '<div class="filter-range" style="display: none;">', // TODO split filter range to add filter range select to this.elements
        filter_range_group: '<div class="input-group">',
        filter_range_label: '<label class="form-label my-auto mx-2" for="range-select">نوع فیلتر :</label>',
        filter_range_select: 
            '<select class="form-select range-select">' +
            '   <option value="">برابر با</option>' +
            '   <option value="lt">کم تر از</option>' +
            '   <option value="lte">کم تر مساوی</option>' +
            '   <option value="gt">بیش تر از</option>' +
            '   <option value="gte">بیش تر مساوی</option>' +
            '</select>',
        filter_form: '<div class="filter-form">',
        filter_submit: '<button class="btn btn-primary mb-3 mx-2 filter-submit" style="display: none;">',
        filters: '<div class="d-flex flex-wrap justify-content-right mb-2 filters">',
    };
    
    function PageFlow(element, options) {
        this.element = $(element);
        this.order_by = null;
        this.order_type = "";
        this.page_size = 10;
        this.applied_filters = [];
        // true signifies deep cloning, ensuring that the defaults object is copied deeply
        this.settings = $.extend(true, {}, defaults, options);
        this.elements = {}
        this.add_pagination_elements();
        this.add_filter_elements();
        this.init_order();
        this.init_page_size();
        this.init_filter();
        this.init_pagination();
        console.log(this.settings.load_func);
    }

    PageFlow.prototype.init_order = function() {
        const self = this;
        const ths = this.element.find(self.settings.order_selector);
        ths.unbind("click");
        ths.on("click", function () {
            
            if ($(this).data("name")) {
                $("#sort-icon").remove();
                var name = $(this).data("name");
                if (self.order_by === name) {
                    self.order_type = self.order_type == "" ? "-" : "";
                } else {
                    self.order_by = name;
                    self.order_type = "";
                }
                var icon = $("<i class='bi mx-1' id='sort-icon'>");
                icon_class =
                self.order_type == "" ? self.settings.asc_icon : self.settings.desc_icon;
                icon.addClass(icon_class);
                $(this).append(icon);
                self.settings.load_func({
                    order: `${self.order_type}${self.order_by}`,
                    filters: JSON.stringify(self.applied_filters),
                    page_size: self.page_size,
                });
            }
        });
    }

    PageFlow.prototype.init_page_size = function() {
        const self = this;
        self.elements.page_size_select.val(self.page_size);
        self.elements.page_size_select.unbind("change");
        self.elements.page_size_select.on("change", function () {
            self.page_size = self.elements.page_size_select.val();
            var params = {
                filters: JSON.stringify(self.applied_filters),
                page_size: self.page_size,
            };
            if (self.order_by) {
                params.order = `${self.order_type}${self.order_by}`;
            }
            self.settings.load_func(params);
        });
    }

    PageFlow.prototype.add_pagination_elements = function() {
        const pagination_container = $(templates.pagination_container);
        this.elements.count_items = $(templates.count_items);
        pagination_container.append(this.elements.count_items);
        this.elements.pagination = $(templates.pagination);
        pagination_container.append(this.elements.pagination);
        const pagination_input_group = $(templates.pagination_input_group);
        pagination_input_group.append($(templates.pagination_input_label).append($(this.settings.list_icon)));
        this.elements.page_size_select = $(templates.pagination_select);
        this.settings.per_page_values.forEach(value => {
            this.elements.page_size_select.append($(`<option value='${value}'>`).text(value));
        });
        pagination_input_group.append(this.elements.page_size_select);
        pagination_container.append(pagination_input_group);
        this.element.prepend([pagination_container]);
    }

    PageFlow.prototype.add_filter_elements = function() {
        const filter_container = $(templates.filter_container);
        const filter_select_group = $(templates.filter_select_group);
        filter_select_group.append($(templates.filter_select_label).append($(this.settings.filter_icon)));
        this.elements.filters_select = $(templates.filters_select);
        this.elements.filters_select.append($(templates.filters_select_none_option));
        this.settings.filters.forEach(filter => {
            var option = $(`<option value='${filter.value}' data-type="${filter.type}">`).text(filter.text);
            if(filter.type === "select"){
                console.log(filter.options);
                option.data("options", filter.options);
            }
            this.elements.filters_select.append(option);
        });
        filter_select_group.append(this.elements.filters_select);
        this.elements.filter_range = $(templates.filter_range);
        const filter_range_group = $(templates.filter_range_group).append($(templates.filter_range_label));
        this.elements.filter_range_select = $(templates.filter_range_select);
        filter_range_group.append(this.elements.filter_range_select);
        this.elements.filter_range.append(filter_range_group);
        this.elements.filter_form = $(templates.filter_form);
        this.elements.filter_submit = $(templates.filter_submit).text('فیلتر');
        filter_container.append(filter_select_group);
        filter_container.append(this.elements.filter_range);
        filter_container.append(this.elements.filter_form);
        filter_container.append(this.elements.filter_submit);
        this.elements.filters = $(templates.filters)
        this.element.prepend(this.elements.filters)
        this.element.prepend(filter_container);
    }

    PageFlow.prototype.init_filter = function() {
        const self = this;
        self.elements.filters_select.unbind("change");
        self.elements.filters_select.on("change", function () {
            self.elements.filter_form.empty();
            self.elements.filter_submit.hide();
            switch ($(this).find(":selected").data("type")) {
                case "number":
                    self.elements.filter_range.show();
                    self.elements.filter_range.find("select option:nth-child(odd)").show();
                    var input_group = $(templates.filter_input_group);
                    self.filter_label = input_group.find("label");
                    self.filter_label.text($(this).find(":selected").text() + " :");
                    self.filter_input = input_group.find("input");
                    self.filter_input.data("type", $(this).find(":selected").data("type"));
                    self.elements.filter_form.append(input_group);
                    self.elements.filter_submit.show();
                    break;
                case "text":
                    self.elements.filter_range.hide();
                    var input_group = $(templates.filter_input_group);
                    self.filter_label = input_group.find("label");
                    self.filter_label.text($(this).find(":selected").text() + " :")
                    self.filter_input = input_group.find("input");
                    self.filter_input.data("type", $(this).find(":selected").data("type"));
                    self.elements.filter_form.append(input_group);
                    self.elements.filter_submit.show();
                    break;
                case "bool":
                    // TODO True or false preview for boolean filters (needed in procurement > supplies for supply field)
                    self.elements.filter_range.hide();
                    var input_group = $(templates.filter_bool_input_group);
                    self.filter_label = input_group.find("label");
                    self.filter_label.text($(this).find(":selected").text() + " :")
                    self.filter_input = input_group.find("input");
                    self.elements.filter_form.append(input_group);
                    self.elements.filter_submit.show();
                    break;
                case "datetime":
                case "date":
                    self.elements.filter_range.show();
                    self.elements.filter_range.find("select option:nth-child(odd)").hide();
                    self.elements.filter_range.find("select").val("lt");
                    var input_group = $(templates.filter_input_group);
                    self.filter_label = input_group.find("label");
                    self.filter_label.text($(this).find(":selected").text() + " :")
                    self.filter_input = input_group.find("input");
                    self.filter_input.data("type", $(this).find(":selected").data("type"));
                    self.elements.filter_form.append(input_group);
                    new mds.MdsPersianDateTimePicker(document.querySelector('#filter-input'), {
                        targetTextSelector: '#filter-input',
                        enableTimePicker: $(this).find(":selected").data("type") === "datetime",
                    });
                    self.elements.filter_submit.show();
                    break;
                case "select":
                    self.elements.filter_range.hide();
                    var input_group = $(templates.filter_form_select_group);
                    self.filter_label = input_group.find("label");
                    self.filter_label.text($(this).find(":selected").text() + " :")
                    self.filter_input = input_group.find("select");
                    self.elements.filter_form.append(input_group);
                    self.elements.filter_submit.show();
                    var options = $(this).find(":selected").data("options");
                    console.log(input_group);
                    self.filter_input.empty();
                    options.forEach(option => {
                        self.filter_input.append($(`<option value='${option.val}'>`).text(option.text));
                    });
                    break;
            }
        });
        self.elements.filter_submit.on("click", function () {
            var type = self.filter_input.data("type") == "checkbox" ? "bool" : self.filter_input.data("type");
            var val = self.filter_input.data("type") == "checkbox" ? self.filter_input.is(":checked") : self.filter_input.val();
            var val_display = val;
            if (self.filter_input.prop("tagName") == "SELECT"){
                val = self.filter_input.find(":selected").val();
                val_display = self.filter_input.find(":selected").text();
                type = "select"
            }
            var id = self.applied_filters.length == 0 ? 1 : self.applied_filters[self.applied_filters.length -1 ].id + 1;
            var range = self.elements.filter_range.is(":visible") ? self.elements.filter_range_select.val() : "";
            var range_text = self.elements.filter_range.is(":visible") ? self.elements.filter_range_select.find(":selected").text() : "";
            self.applied_filters.push({
                "id": id,
                "type": type,
                "name": self.elements.filters_select.find(":selected").text(),
                "key": self.elements.filters_select.find(":selected").val(),
                "val": val,
                "val_display": val_display,
                "range": range,
                "range_text": range_text,
                
            });
            self.reload_filters_div();
            self.elements.filters_select.val("none");
            self.elements.filter_form.empty();
            self.elements.filter_submit.hide();
            self.elements.filter_range.hide();
        });
        
    }

    PageFlow.prototype.reload_filters_div = function(){
        const self = this;
        self.elements.filters.empty();
        self.applied_filters.forEach(filter => {
            var filter_val = typeof filter.val  != "boolean" ? filter.val_display : filter.val ? "بلی" : "خیر";
            var filter_badge = $(`<span class="badge bg-secondary me-1" data-id="${filter.id}">`).text(`${filter.name} ${filter.range_text}: ${filter_val}`)
            filter_badge.append($("<a href='#' class='link-light'>").append($('<i class="bi bi-x">')).on("click", function(){
                self.applied_filters = self.applied_filters.filter(function(item) {
                    return item.id !== filter.id;
                });
                self.reload_filters_div();
            }))
            self.elements.filters.append(filter_badge);
        });
        var params = {
            page_size: self.page_size,
            filters: JSON.stringify(self.applied_filters),
        };
        if (self.order_by) {
            params.order = `${self.order_type}${self.order_by}`;
        }
        self.settings.load_func(params);
    }

    PageFlow.prototype.init_pagination = function() {
        const self = this;
        self.elements.count_items.text(toPersianNum(self.settings.count_items) + " مورد یافت شد.");
        self.elements.pagination.twbsPagination("destroy");
        if (self.settings.count_pages > 0 ){
            self.elements.pagination.twbsPagination({
                totalPages: self.settings.count_pages,
                visiblePages: 5,
                first: self.settings.first_icon,
                prev: self.settings.prev_icon,
                next: self.settings.next_icon,
                last: self.settings.last_icon,
                onPageClick: function (event, page) {
                    var params = {
                        page: page,
                        page_size: self.page_size,
                        filters: JSON.stringify(self.applied_filters),
                    };
                    if (self.order_by) {
                        params.order = `${self.order_type}${self.order_by}`;
                    }
                    self.settings.load_func(params);
                },
            });
        }
    }

    $.fn[pluginName] = function(options) {
        return this.each( function (){
            var pagination = $.data(this, "plugin_" + pluginName);
            if (!pagination) {
                $.data(this, "plugin_" +
                    pluginName, new PageFlow(this, options));
            }else{
                var count_pages = options.count_pages ? options.count_pages : 1
                var count_items = options.count_items ? options.count_items : 0
                if (pagination.settings.count_pages != count_pages | pagination.settings.count_items != count_items) {
                    pagination.settings.count_pages = count_pages;
                    pagination.settings.count_items = count_items;
                    pagination.init_pagination();
                }
            }
        })
    }

}(jQuery));
