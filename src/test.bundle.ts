import $ from 'jquery';
import 'jquery-typeahead';

$(function(){
  console.log('hello')
  $('input').typeahead({
    source: { data: ['foo', 'bar', 'baz'], },
    matcher: function(item, displayKey){
      console.log({item, displayKey});
      return true;
    }
  })
})
