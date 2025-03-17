import { listItemCreate } from "./suggestion_widget_base.js";


export async function onLoadAPI(argMap) {   
    
    
    
      const inputElement = document.getElementById(argMap.inputId);
      let previousInput = inputElement.value;
      var token = sessionStorage.getItem('sessionToken');
      
   
    
      if (token === null) {
        token = self.crypto.randomUUID();
        sessionStorage.setItem('sessionToken', token);

      }
      console.log(token);
      var request = {
        'input': previousInput,
        'sessionToken': token,
        's': argMap.s,
        'url': document.URL,
        
      };
      console.log(request);

      const title = document.getElementById("suggestion_title");
   
      const resultsElement = document.getElementById("suggestion_results");
      resultsElement.setAttribute('hidden', 'true');

      window.addEventListener('autofill', function(event) {
        previousInput = '';
        title.innerHTML = '';
        resultsElement.innerHTML = '';
        resultsElement.setAttribute('hidden', 'true');
      });
      const dbTimeoutDuration = 300;
      let debounceTimeout;

      inputElement.addEventListener("input", async function(event) {
        
        const currentInput = event.target.value;
        console.log(currentInput);
        console.log(token);
        if (currentInput.length > 1) {
          if (currentInput !== previousInput) {
     
            previousInput = currentInput;
            request.input = currentInput;


            const style = document.createElement('link');
            style.setAttribute('id', 'suggestion_widget_style');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', './widget_style.css');
            document.head.appendChild(style);

         
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(async () => {
              if (inputElement.value !== '') {
              const to_fetch = 'https://fertilizerapi.com/api/place_suggestions/?' + new URLSearchParams(request).toString();
              console.log(to_fetch);
              const { suggestions } = await fetch(to_fetch, 
                {
                method: 'GET',
           

                }

              ).then(response => response.json());
              console.log(suggestions);
              title.innerHTML = '';
              title.appendChild(
                document.createTextNode('Query predictions for "' + request.input + '":'),
              );

              console.log(resultsElement);
              resultsElement.innerHTML = '';
           
              for (let suggestion of suggestions) {
                const placePrediction = suggestion.placePrediction;
 
           
                  const listItem = listItemCreate(placePrediction, token, argMap);
               
              

              
            resultsElement.appendChild(listItem);
            }
            resultsElement.removeAttribute('hidden');

          }
        }
        ,dbTimeoutDuration);
        
          }
          else {
            previousInput = '';
  
            title.innerHTML = ''; 
            
            resultsElement.innerHTML = ''; 
            


          }

      
}
else {
  previousInput = '';
  
  title.innerHTML = ''; 
  
  resultsElement.innerHTML = ''; 
  
  resultsElement.setAttribute('hidden', 'true');

}
});
    }
