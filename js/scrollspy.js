jQuery(document).ready(function($){
    scrollspy = function scrollspy() {
        var isles = $(".isle");
        var offsets = $.map(isles,function(obj){
            return $(obj).offset().left;
        });
        for (var i = 0 ; i < offsets.length ; i++ ) {
            if (offsets[i] >= 100) {
                break;
            }
        }
        var id = (i === 0) ? "isle-0" : $(isles[i - 1]).attr("id");
        $(".isle-page").removeClass("active");
        var selector = ".isle-page a[data-href='#" + id + "']";
        $(selector).closest(".isle-page").addClass("active");
    };
   
});
