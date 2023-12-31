import axios from "axios"
import { toast } from "react-hot-toast"

const URL = `${process.env.REACT_APP_BACKEND_URL}/payment`;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export async function verifySignature(body, token){
  const toastid = toast.loading("Verifying Payment...");
  console.log("Came into frontend verify signature")
  try{
    const response = await axios.post(URL+"/verifySignature", body, {headers: {
      Authorization: `Bearer ${token}`
    }})
    toast.success("Payment Successful!")
  } catch(err){
    console.log("Verifying payment Error....", err);
    toast.error("Could not verify payment")
  }
  toast.dismiss(toastid)
} 

export async function buyCourse(body, token, userd) {
  try{
    const response = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if(!response){
      toast.error("Razorpay SDK Failed to laod"); 
      return;
    }
    const orderResponse = await axios.post(URL+"/capturePayment", body, {headers: {
      Authorization: `Bearer ${token}`
    }})
    if(!orderResponse){
      console.log('Error in capturing order!');
    }
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: `${orderResponse.data.paymentResponse.amount}`, 
      currency: orderResponse.data.paymentResponse.currency,
      name: "Pizza Factory",
      description: "Test Transaction",
      "account_id": "acc_Ef7ArAsdU5t0XL",
      order_id: orderResponse.data.paymentResponse.id, 
      prefill: {
          name: `${userd.firstName}`,
          email: `${userd.email}`,
          contact: "1234567890"
      },
      handler: function (res){
        console.log("first")
        sendPaymentSuccessEmail(
					res,
					orderResponse.data.paymentResponse.amount,
					token
				);
        verifySignature({...res, body}, token)
      },
    };
    console.log(options)
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function(response){
      toast.error("OOPS!! Payment Failed")
      alert(response.error.code);
    })
    console.log("Payment success");
  } catch(err){
    console.log(err)
    toast.error("Could Not make Payment!")
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
	try {
		await axios.post(
			URL + "/sendPaymentSuccessEmail",
			{
				orderId: response.razorpay_order_id,
				paymentId: response.razorpay_payment_id,
				amount,
			},
			{headers: {
        Authorization: `Bearer ${token}`
      }}
		);
	} catch (error) {
		console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
	}
}
