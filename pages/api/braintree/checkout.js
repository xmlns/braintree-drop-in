import gateway from "../../utils/gateway";

export default async function checkout(req, res) {
  console.log(req.body);
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amt = req.body.amount;
  const customField = req.body.customFieldString;
  const transaction = gateway.transaction.sale(
    {
      amount: amt,
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
