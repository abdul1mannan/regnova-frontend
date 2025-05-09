import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComplianceAssistant() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome 👋</h2>
        <p className="text-slate-500">Explore our regulatory compliance assistant</p>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-400"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-700 text-xl font-semibold">
            Regulatory Compliance Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-slate-600 text-sm">
            Get expert guidance on regulatory compliance for food, cosmetics, and health supplement products in Malaysia.
          </p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-slate-700">How it works:</h3>
            <ol className="list-decimal list-inside text-slate-600 space-y-1.5 text-sm pl-1">
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Select your product category</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Upload relevant documents</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Get compliance assessment</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Receive timeline and cost estimates</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-slate-700">Supported uploads:</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1.5 text-sm pl-1">
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Ingredient lists (PDF, DOCX, CSV)</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Product formulations (PDF, DOCX, XLSX)</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Product labels and artwork (JPG, PNG)</li>
              <li className="transition-transform duration-200 hover:-translate-y-0.5">Certificates (PDF, DOCX)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 