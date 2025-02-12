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
          <h1 className="text-3xl font-bold mb-6">Return and Exchange Policy</h1>
          <h1 className="text-l font-light mb-6">Effective Date: 1 March 2025</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Return Window</h2>
              <p className="text-gray-700">
                You have 14 days from the date of delivery to initiate a return. The item must be unused, unworn, and in its original packaging with all tags attached.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Return Process</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Contact our customer service team to initiate your return</li>
                <li>Pack the item securely in its original packaging</li>
                <li>Attach the provided return label to your package</li>
                <li>Drop off the package at the nearest authorized shipping location</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Refund Policy</h2>
              <p className="text-gray-700">
                Once we receive and inspect the returned item, we will process your refund within 5-7 business days. The refund will be issued to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Non-Returnable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Items marked as final sale</li>
                <li>Intimate apparel</li>
                <li>Items that show signs of wear or use</li>
                <li>Items without original tags and packaging</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our return policy, please contact our customer service team.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ReturnPolicy;
