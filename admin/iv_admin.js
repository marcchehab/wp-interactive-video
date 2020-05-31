jQuery(document).ready(function ($) {

    //Edits row. Assumes to be called on tr-element.
    $.fn.iv_editbet = function() {
        if (!$(this).is("tr")) { 
            return false;
        }

        let elements = []; //DOM-Elements
        let values = []; //Current values
        values[0]=$(this).data("qid");
        elements[1]=$(this).find("td.column-qphrase strong");
        values[1]=elements[1].html();
        elements[2]=$(this).children("td.column-qtype");
        values[2]=elements[2].data("qtype"); 
        elements[3]=$(this).children("td.column-timelimit");
        values[3]=elements[3].html(); 
        elements[4]=$(this).children("td.column-author");
        values[4]=elements[4].data("userid");

        elements[1].html("<input type=\"text\" name=\"qphrase\" class=\"ptitle\" value=\""+values[1]+"\">");
        elements[3].html("<input type=\"text\" name=\"qphrase\" class=\"ptitle\" value=\""+values[3]+"\">");
        elements[4].html("<input type=\"text\" name=\"qphrase\" class=\"ptitle\" value=\""+values[4]+"\">");

        return this;
    }

    $(".vc_slidercontainers").children(".vc_sliders").on("input", function() {
        if (this.value < 61) {
            $(this).siblings(".vc_slideroutputs").html(this.value);
        } else {
            $(this).siblings(".vc_slideroutputs").html("&infin;");
        }
    });

    $(".iv_betlists .row-actions .edits").click(function(){
        $(this).parents("tr").iv_editbet();
    });
});