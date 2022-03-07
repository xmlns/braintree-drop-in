import { Button, InputGroup, FormControl } from "react-bootstrap";
import { useState } from "react";
import DropIn from "braintree-web-drop-in-react";

export default function Braintree() {
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [amount, setAmount] = useState("");
  const [customField, setCustomField] = useState(false);

  const [instance, setInstance] = useState(null);
  const TOKENIZATION_KEY = "sandbox_x6p2tjkn_jbcyfzqkd6dgzdft";

  const buySomething = async (amount, customField) => {
    const { nonce } = await instance.requestPaymentMethod();
    const res = await fetch("/api/braintree/checkout", {
      body: JSON.stringify({
        paymentMethodNonce: nonce,
        amount: amount,
        customFieldString: customField,
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
            flexDirection: "column",
          }}
        >
          <DropIn
            options={{ authorization: TOKENIZATION_KEY }}
            onInstance={(instance) => setInstance(instance)}
          />

          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon2">$</InputGroup.Text>
            <FormControl
              placeholder="Custom Amount"
              aria-label="Custom Amount"
              aria-describedby="basic-addon2"
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <FormControl
              placeholder="Some string to be sent w payment"
              aria-label="Custom Field"
              onChange={(e) => setCustomField(e.target.value)}
            />
          </InputGroup>

          <Button
            variant="primary"
            onClick={async () => buySomething(amount, customField)}
          >
            Submit
          </Button>
        </div>
      )}
    </>
  );
}
