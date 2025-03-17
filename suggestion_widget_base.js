export function renderWidget() {
    const widget = document.createElement('div');
    widget.setAttribute('id', 'suggestion_widget');

    const title = document.createElement('title');
    title.setAttribute('id', 'suggestion_title');
    widget.appendChild(title);

    const results = document.createElement('div');
    results.setAttribute('id', 'suggestion_results');
    widget.appendChild(results);

    return widget;


}
function triggerAutofill(placePayload) {
    const event = new CustomEvent('autofill', {'detail': placePayload});
    window.dispatchEvent(event);
    
}

export function listItemCreate(placePrediction, token, argMap) {
    console.log(placePrediction);
    const listItem = document.createElement("li");
    const dbTimeoutDuration = 300;
    listItem.setAttribute('id', 'suggestion_result_' + String(document.querySelectorAll('#suggestion_results li').length));
    listItem.setAttribute('class', 'suggestion_result');
    
    let debounceTimeout;
    listItem.addEventListener('click', async function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const placeId = placePrediction.placeId;
            const request = {
                'placeId': placeId,
                'sessionToken': token,
                's': argMap.s,
                'url': document.URL,
            };
            const placeComponents = await fetch('https://fertilizerapi.com/api/place_details/?' + new URLSearchParams(request).toString(),
                {
                    method: 'GET',
                
                    
                    
                }
            ).then(response => response.json());
            console.log(placeComponents);
            triggerAutofill(placeComponents);
            
        })}, dbTimeoutDuration);
    const pin = document.createElement('img');
    pin.setAttribute('src', './pin.svg');
    pin.setAttribute('alt', 'Pin');
    pin.setAttribute('class', 'pin');
    listItem.appendChild(pin);
    listItem.appendChild(
        document.createTextNode(placePrediction.text.text.toString()),
    );

    return listItem;
}
