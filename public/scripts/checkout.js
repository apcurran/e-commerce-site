"use strict";

const stripe = Stripe("pk_test_51GyOBXEFSgPrRFzWmUBqUfL9lNgsZR7qWlzKEQe7hTRs48845plWirspdaEqDps99uKE3MumJXsyjJPlSXoCGgOR0089tYnp4V");
const elements = stripe.elements();
const form = document.querySelector(".checkout-form");
const csrfToken = document.getElementById("csrf-token").value;

const PAYMENT_INTENT_API_URL = "https://apcurran-heroes-for-sale.herokuapp.com/api/create-payment-intent";
const SUCCESS_API_URL = "https://apcurran-heroes-for-sale.herokuapp.com/api/successful-order";

async function fetchPaymentIntent() {
    try {
        const options = {
            headers: {
                "CSRF-Token": csrfToken
            },
            method: "POST"
        };

        const result = await fetch(PAYMENT_INTENT_API_URL, options);
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
        sendSuccessfulOrderInfo(result.paymentIntent.id);

        document.getElementById("submit").disabled = true;

        resultMsgPara.textContent = "Payment success! An email with the download code for your games will be sent shortly.";

        const homeLink = document.createElement("a");
        homeLink.classList.add("checkout__link", "underline");
        homeLink.href = "/";
        homeLink.textContent = "Back to games";

        form.append(homeLink);
    }
}

async function sendSuccessfulOrderInfo(paymentId) {
    try {
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                payment_id: paymentId
            })
        };

        await fetch(SUCCESS_API_URL, options);

    } catch (err) {
        console.error(err);
    }
}

fetchPaymentIntent();