import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useState } from "react";
import DropIn from "braintree-web-drop-in-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Braintree() {
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState(false);
  const [cvv, setCVV] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [street, setStreet] = useState("");

  const [instance, setInstance] = useState(null);

  const TOKENIZATION_KEY = "sandbox_x6p2tjkn_jbcyfzqkd6dgzdft";

  const buySomething = async (amount, cvv, street, zip, walletAddress) => {
    const { nonce } = await instance.requestPaymentMethod();
    const res = await fetch("/api/braintree/checkout", {
      body: JSON.stringify({
        paymentMethodNonce: nonce,
        amount: amount,
        walletAddress: walletAddress,
        cvv: cvv,
        billingAddress: { street: street, zip: zip },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = await res.json();
    console.log(result);
    if (result.result == "success") {
      setPurchaseComplete(true);
    }
  };

  return (
    <>
      {purchaseComplete ? (
        <h1>Purchase Complete</h1>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DropIn
            options={{ authorization: TOKENIZATION_KEY }}
            onInstance={(instance) => setInstance(instance)}
          />

          <Form style={{ marginLeft: 20, marginTop: 200 }}>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <FormControl
                placeholder="$"
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <FormControl
                placeholder="CVV"
                onChange={(e) => setCVV(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <FormControl
                placeholder="123 Street"
                onChange={(e) => setStreet(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ZipCode</Form.Label>
              <FormControl
                placeholder="Zip"
                onChange={(e) => setZipcode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Wallet Address</Form.Label>
              <FormControl
                placeholder="0x1234..."
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              onClick={async () =>
                buySomething(amount, cvv, street, zipcode, walletAddress)
              }
            >
              Submit
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}
