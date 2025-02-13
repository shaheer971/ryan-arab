import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ReturnPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="my-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Return & Exchange Policy</h1>
          <h2 className="text-lg font-light mb-6">Effective Date: 1 March 2025</h2>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold mb-3">Return Eligibility</h3>
              <p>At Ryan Arab, we uphold a return and exchange policy to maintain fairness, prevent abuse, and protect the integrity of our products. By making a purchase, you fully agree to the terms outlined below.</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-4">
                <li>All sales are final, and returns are only accepted under exceptional circumstances.</li>
                <li>Return requests must be submitted within 3 days of delivery and meet all of the following conditions:
                  <ul className="list-circle list-inside ml-6 space-y-1 mt-2">
                    <li>The item is completely unused, unworn, and in its original, factory-sealed condition.</li>
                    <li>All original packaging, shoebox, tags, and accessories are intact and undamaged.</li>
                    <li>Shoeboxes must be returned inside an additional protective layer—damaged boxes will result in return refusal.</li>
                  </ul>
                </li>
                <li>Any return that does not meet ALL of these conditions will be automatically rejected, and the item will be sent back at the customer's expense.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Exchange Policy</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Exchanges are only allowed for sizing issues, provided the request is made within 5 days of delivery.</li>
                <li>Only one exchange request per order—multiple exchanges are not allowed.</li>
                <li>If the requested size is out of stock, no exchange or refund will be provided.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Return Process & Costs</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Customers are fully responsible for all return shipping costs. We do not provide prepaid return labels.</li>
                <li>Returns must be shipped via a tracked, insured shipping service, as we are not liable for lost, damaged, or misplaced returns.</li>
                <li>Unauthorized returns (returns sent without prior written approval) will be automatically refused and returned at the customer's expense.</li>
                <li>A 15% restocking fee will be deducted from all refunds to cover handling and administrative costs.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Refunds for Shipping & Processing Fees</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Original shipping fees, handling fees, and payment processing charges are strictly non-refundable.</li>
                <li>If an order qualifies for a refund, it will be issued only via store credit—no cash refunds will be provided.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Defective or Incorrect Items – Reporting Process</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>If you receive a damaged, defective, or incorrect item, you must notify us within 24 hours of delivery by emailing info@ryanarab.sa with:
                  <ul className="list-circle list-inside ml-6 space-y-1 mt-2">
                    <li>Your order number in the subject line of the email.</li>
                    <li>Clear, time-stamped photos or videos showing the issue.</li>
                  </ul>
                </li>
                <li>Failure to report defects within 24 hours will result in return denial.</li>
                <li>If the defect is verified, we may provide:
                  <ul className="list-circle list-inside ml-6 space-y-1 mt-2">
                    <li>A replacement (if available).</li>
                    <li>Store credit (if no replacement is available).</li>
                    <li>No cash refunds will be issued.</li>
                  </ul>
                </li>
                <li>If we determine the damage is not due to a manufacturing defect (e.g., improper use, wear and tear, or deliberate damage), the claim will be rejected.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Important: Email Subject Format Requirement</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>All return, refund, or exchange requests MUST include the order number in the subject line of the email (e.g., "Order #12345 – Return Request").</li>
                <li>Failure to include the order number in the subject line will result in your email being deemed HIGH PRIORITY, which automatically disqualifies you from receiving a refund or exchange.</li>
                <li>This rule applies to all claims, including defective or incorrect items.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Non-Returnable & Non-Refundable Items</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Final Sale, Limited Edition, and Custom-Made Items are 100% non-returnable & non-refundable.</li>
                <li>Any product showing signs of wear, use, tampering, or packaging damage will not be accepted for return.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Failed Deliveries & Re-Delivery Fees</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>If an order is returned due to an incorrect address, multiple failed delivery attempts, or refusal to accept the package, the customer must:
                  <ul className="list-circle list-inside ml-6 space-y-1 mt-2">
                    <li>Pay re-delivery costs upfront.</li>
                    <li>Cover any return shipping fees incurred.</li>
                  </ul>
                </li>
                <li>Failure to pay re-delivery costs within 7 days will result in order cancellation, with only store credit issued (no refunds).</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Chargeback & Dispute Policy</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Initiating a chargeback or payment dispute without first contacting us will result in immediate account suspension and banning from future purchases.</li>
                <li>We reserve the right to pursue legal action for fraudulent chargebacks and recover all associated fees.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ReturnPolicy;
