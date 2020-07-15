"use strict";

const stripe = Stripe("pk_test_51GyOBXEFSgPrRFzWmUBqUfL9lNgsZR7qWlzKEQe7hTRs48845plWirspdaEqDps99uKE3MumJXsyjJPlSXoCGgOR0089tYnp4V");
const elements = stripe.elements();
const form = document.querySelector(".checkout-form");

async function fetchPaymentIntent() {
    try {
        const result = await fetch("http://localhost:5000/api/create-payment-intent", { method: "POST" });
        var data = await result.json();
    } catch (err) {
        console.error(err);
    }

    // Setup
    const elements = stripe.elements();

    const style = {
        base: {
          color: "#32325d",
          fontFamily: 'Muli, Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#32325d"
          }
        },
        invalid: {
          fontFamily: 'Muli, Arial, sans-serif',
          color: "#fa755a",
          iconColor: "#fa755a"
        }
    };

    const card = elements.create("card", { style });

    // Stripe injects an iframe into the DOM
    card.mount("#card-element");

    card.on("change", event => {
        const cardErrorPara = document.getElementById("card-errors");

        cardErrorPara.textContent = event.error ? event.error.message : "";
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        payWithCard(stripe, card, data.clientSecret);
    });
}

async function payWithCard(stripe, card, clientSecret) {
    try {
        var result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card
            }
        });
        
    } catch (err) {
        console.error(err);
    }
    
    
    const resultMsgPara = document.querySelector(".result-message");
    
    if (result.error) {
        resultMsgPara.textContent = result.error.message;
    } else {
        document.getElementById("submit").disabled = true;

        resultMsgPara.textContent = "Payment success!";

        const homeLink = document.createElement("a");
        homeLink.classList.add("checkout__link", "underline");
        homeLink.href = "/";
        homeLink.textContent = "Back to games";

        form.append(homeLink);
    }
}

fetchPaymentIntent();