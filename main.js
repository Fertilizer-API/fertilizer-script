
import {onLoadAPI} from './new_init.js';
import { renderWidget } from './suggestion_widget_base.js';


window.addEventListener('load', async function() {
console.log('g_include.js loaded');
if (typeof scriptTag === 'undefined') {
    var scriptTag = document.querySelector('#form_autofill_include');
}

if (typeof fieldData === 'undefined') {
    
    var fieldData = JSON.parse(scriptTag.getAttribute('data'));

} 



const widget = renderWidget();


const input = document.getElementById(fieldData.address1.id);
input.parentNode.insertBefore(widget, input.nextSibling);


const argMap = {}
argMap.inputId = fieldData.address1.id;
argMap.s = fieldData.s;
delete fieldData.s;

await onLoadAPI(argMap);


var fieldMap = {};
for (var key in fieldData) {
    if (typeof fieldData[key].id !== 'undefined') {
        fieldMap[key] = document.getElementById(fieldData[key].id);
    }
    else {
    fieldMap[key] = document.querySelector(selectorMap[key]);
    }
}



function prepareFillData(addressComponents) {
    //const addressComponents = place.addressComponents;
    addressComponents = addressComponents.addressComponents;
    const fieldComponentTypeMap = {
        'address1': new Set(['street_number', 'route', 'intersection']),
        'city': new Set(['locality']),
        'state': new Set(['administrative_area_level_1']),
        'zip': new Set(['postal_code']),
        'country': new Set(['country']),
    };

    const finalMap = {};
    
    for (var key in fieldComponentTypeMap) {
        if (key !== 'address1') {
            var component = fieldComponentTypeMap[key];
     
        for (var i = 0; i < addressComponents.length; i++) {
            var currentSet = new Set(addressComponents[i].types);
            console.log(currentSet.intersection(component));
            console.log(component);
            if (currentSet.intersection(component).size === component.size) {
                finalMap[key] = addressComponents[i].longText;
                break;
                    }
  
            }
        }
        else {
            var streetNumber = '';
            var street = '';
            for (var i = 0; i < addressComponents.length; i++) {
                if (new Set(addressComponents[i].types).has('street_number')) {
                    streetNumber = addressComponents[i].longText;
                    
                }
                else if (new Set(addressComponents[i].types).has('route') || new Set(addressComponents[i].types).has('intersection')) {
                    street = addressComponents[i].longText;
                }
            }
            finalMap[key] = streetNumber + ' ' + street;

        }
        

}
    return finalMap;
}
function autoFill(event) {
    const addressComponents = event.detail;
    const fillData = prepareFillData(addressComponents);

    for (var key in fillData) {
        if (typeof fieldMap[key] !== 'undefined') {
            if (fieldMap[key].tagName === 'SELECT') {
                var doesNotExist = true;
                var options = fieldMap[key].options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value === fillData[key]) {
                        fieldMap[key].selectedIndex = i;
                        doesNotExist = false;
                        break;
                    }
                }
                if (doesNotExist) {
                    var option = document.createElement('option');
                    option.value = fillData[key];
                    option.text = fillData[key];
                    fieldMap[key].appendChild(option);
                    fieldMap[key].selectedIndex = options.length - 1;
                }
            }
            else {
        fieldMap[key].value = fillData[key];
    }
}

}
}
window.addEventListener('autofill', autoFill);
} );
