import gateway from "../../utils/gateway";

export default async function checkout(req, res) {
  console.log(req.body);
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amt = req.body.amount;
  const walletAddress = req.body.walletAddress;
  const creditCardCVV = req.body.cvv;
  const address = req.body.billingAddress;

  const transaction = gateway.transaction.sale(
    {
      amount: amt,
      billing: {
        streetAddress: address.street,
        postalCode: address.zip,
      },
      creditCard: {
        cvv: creditCardCVV,
      },
      customFields: {
        walletaddress: walletAddress,
      },
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (result) {
        res.status(201).json({ result: "success" });
      } else {
        res.status(500).send(error);
      }
    }
  );
}
