import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComplianceAssistant() {
  return (
    <Card className="  w-[400px] m-6 border-2 border-red-200 pt-10">
      <CardHeader>
        <CardTitle className="text-green-600 text-2xl font-bold">
          Regulatory Compliance Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700">
          Get expert guidance on regulatory compliance for food, cosmetics, and health supplement products in Malaysia.
        </p>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">How it works:</h3>
          <ol className="list-decimal list-inside text-gray-800 space-y-1">
            <li>Select your product category</li>
            <li>Upload relevant documents</li>
            <li>Get compliance assessment</li>
            <li>Receive timeline and cost estimates</li>
          </ol>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Supported uploads:</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            <li>Ingredient lists (PDF, DOCX, CSV)</li>
            <li>Product formulations (PDF, DOCX, XLSX)</li>
            <li>Product labels and artwork (JPG, PNG)</li>
            <li>Certificates (PDF, DOCX)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 