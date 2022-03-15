import '../css/app.css';

(function() {
  const MIN_TEXT_LENGTH = 50;
  const isString = function(input) {
    return typeof(input) === "string";
  }
  
  const ERRORS = {
    firstName: {
      validate: function(input) {
        return input.length && isString(input) && input.length <= MIN_TEXT_LENGTH;
      },
      message: "Invalid first name"
    },
    lastName: {
      validate: function(input) {
        return input.length && isString(input) && input.length <= MIN_TEXT_LENGTH;
      },
      message: "Invalid last name"
    },
    email: {
      validate: function(input) {
        return input.match("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
      },
      message: "Invalid email"
    },
    country: {
      validate: function(input) {
        return input.length && isString(input);
      },
      message: "Invalid country selection",
    },
    phone: {
      validate: function(input) {
        return input.length && isString(input);
      },
      message: "Invalid phone number"
    },
    postalCode: {
      validate: function(input) {
        return input.match("^[0-9]{5}$");
      },
      message: "Invalid postal code"
    },
    creditCard: {
      validate: function(input) {
        return input.match("^[0-9]{16}$");
      },
      message: "Invalid card number"
    },
    CVV: {
      validate: function(input) {
        return input.match("^[0-9]{3}$");
      },
      message: "Invalid security code"
    },
    expDate: {
      validate: function(input) {
        return input.match("^[0-9]{2}\/[0-9]{2}$");
      },
      message: "Invalid expiration date"
    }
  };
  
  const SUCCESS_REQUEST = 200;

  const messageElement = document.getElementById("form-message");

  const renderErrorMessage = function(message) {
      const parseMessage = Object.keys(JSON.parse(message)).map(function(key) {
        return `${ERRORS[key].message}; `;
      });
      messageElement.setAttribute("class", "form-message form-message-error");
      messageElement.innerHTML = message ? parseMessage.join("") : "Oh! Something went wrong.";
  }

  const renderSuccessMessage = function(message, form) {
    const parsedMessage = JSON.parse(message);
    messageElement.setAttribute("class", "form-message form-message-success");
    messageElement.innerHTML = parsedMessage.message;
    form.reset();
  }

  const getValidateMessages = function(data) {
    const keys = Object.keys(data);

    const messages = {};

    keys.forEach(function(key) {
      const value = data[key];
      const validate = ERRORS[key].validate;

      if (!validate(value)) {
        messages[key] = true;
      }
    });

    return JSON.stringify(messages);
  }

  window.addEventListener("load", function () {
      function sendOrder() {
        const XHR = new XMLHttpRequest();
        const FD = new FormData( form );

        const data = Object.fromEntries(FD.entries()); 
        const validationMessages = getValidateMessages(data);
        if (validationMessages) {
          renderErrorMessage(validationMessages);
        }
  
        messageElement.innerHTML = "";
  
        XHR.addEventListener("load", function(event) {
          const message = event.target.responseText;
          
          if (event.target.status !== SUCCESS_REQUEST) {
              renderErrorMessage(message);
          } else {
              renderSuccessMessage(message, form);
          }
        });
  
        XHR.addEventListener( "error", function() {
          renderErrorMessage();
        } );
    
        XHR.open("POST", "/order");
    
        XHR.send(FD);
      }
    
      const form = document.getElementById("order");
    
      form.addEventListener("submit", function ( event ) {
        event.preventDefault();
    
        sendOrder();
      });
    });
})()