$(document).ready(function() {
  
      $(".draggable").on('click', function(e) {
        if (!$(e.target).is('input') && !$(e.target).is('textarea')) {
            var div_text = $(e.target).text();
            $(e.target).data('text', div_text);
            var k = '<textarea rows="5" cols="25">' + div_text + '</textarea><br /><input type="button" value="save"><input type="button" value="cancel">';
            $(e.target).html(k);
        }
        if ($(e.target).is('input') && $(e.target).val() == 'save') {
            $(e.target).parent().html($(e.target).parent().find('textarea').val());

        } else if ($(e.target).is('input') && $(e.target).val() == 'cancel') {
            $(e.target).parent().html($(e.target).parent().data('text'));
        }
    });  
});