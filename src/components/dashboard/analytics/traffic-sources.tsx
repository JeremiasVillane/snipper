"use client";

import { parseAsString, useQueryState } from "nuqs";

import { ShortLinkAnalyticsData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ExportPDFButton } from "./export-pdf-button";
import { ReferrersTable } from "./referrers-table";
import { UtmValueTable } from "./utm-value-table";

interface TrafficSourcesProps {
  clicksByCampaign: ShortLinkAnalyticsData["clicksByCampaign"];
  clicksBySource: ShortLinkAnalyticsData["clicksBySource"];
  clicksByMedium: ShortLinkAnalyticsData["clicksByMedium"];
  clicksByTerm: ShortLinkAnalyticsData["clicksByTerm"];
  clicksByContent: ShortLinkAnalyticsData["clicksByContent"];
  clicksByReferrer: ShortLinkAnalyticsData["clicksByReferrer"];
}

export function TrafficSources({
  clicksByCampaign,
  clicksBySource,
  clicksByMedium,
  clicksByTerm,
  clicksByContent,
  clicksByReferrer,
}: TrafficSourcesProps) {
  const [activeTab, setActiveTab] = useQueryState(
    "source",
    parseAsString.withDefault("campaigns"),
  );

  return (
    <Tabs
      variant="underlined"
      defaultValue="campaigns"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="mb-4 flex h-auto flex-wrap justify-start border-b-0 md:w-auto">
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="mediums">Mediums</TabsTrigger>
        <TabsTrigger value="terms">Terms</TabsTrigger>
        <TabsTrigger value="contents">Contents</TabsTrigger>
        <TabsTrigger value="referrers">Referrers</TabsTrigger>
      </TabsList>

      <TabsContent value="campaigns">
        <ExportPDFButton
          reportTitle="Analytics: Campaigns"
          tableHeaders={["Campaign", "Clicks"]}
          data={Object.entries(clicksByCampaign)}
        />

        <UtmValueTable
          title="Campaign Values"
          paramName="utm_campaign"
          data={clicksByCampaign}
        />
      </TabsContent>

      <TabsContent value="sources">
        <ExportPDFButton
          reportTitle="Analytics: Sources"
          tableHeaders={["Source", "Clicks"]}
          data={Object.entries(clicksBySource)}
        />

        <UtmValueTable
          title="Source Values"
          paramName="utm_source"
          data={clicksBySource}
        />
      </TabsContent>

      <TabsContent value="mediums">
        <ExportPDFButton
          reportTitle="Analytics: Mediums"
          tableHeaders={["Medium", "Clicks"]}
          data={Object.entries(clicksByMedium)}
        />

        <UtmValueTable
          title="Medium Values"
          paramName="utm_medium"
          data={clicksByMedium}
        />
      </TabsContent>

      <TabsContent value="terms">
        <ExportPDFButton
          reportTitle="Analytics: Terms"
          tableHeaders={["Term", "Clicks"]}
          data={Object.entries(clicksByTerm)}
        />

        <UtmValueTable
          title="Term Values"
          paramName="utm_term"
          data={clicksByTerm}
        />
      </TabsContent>

      <TabsContent value="contents">
        <ExportPDFButton
          reportTitle="Analytics: Contents"
          tableHeaders={["Content", "Clicks"]}
          data={Object.entries(clicksByContent)}
        />

        <UtmValueTable
          title="Content Values"
          paramName="utm_content"
          data={clicksByContent}
        />
      </TabsContent>

      <TabsContent value="referrers">
        <ExportPDFButton
          reportTitle="Analytics: Referrers"
          tableHeaders={["Referrer", "Clicks"]}
          data={Object.entries(clicksByReferrer)}
        />

        <ReferrersTable referrersData={clicksByReferrer} />
      </TabsContent>
    </Tabs>
  );
}
