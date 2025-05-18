"use client";

import { useState } from "react";
import { Copy, Key, MoreHorizontal, Trash } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/simple-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateApiKeyDialog from "./create-api-key-dialog";
import DeleteApiKeyDialog from "./delete-api-key-dialog";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
}

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
}

export function ApiKeyTable({ apiKeys }: ApiKeyTableProps) {
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  if (apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No API keys yet</h3>
        <p className="mb-4 mt-1 text-muted-foreground">
          Create your first API key to get started
        </p>
        <CreateApiKeyDialog>
          <Button className="flex md:hidden">Create API Key</Button>
        </CreateApiKeyDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ms-2 flex items-center">Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => {
              const isExpired =
                !!apiKey.expiresAt && new Date() >= apiKey.expiresAt;
              return (
                <TableRow
                  key={apiKey.id}
                  className={isExpired ? "text-destructive line-through" : ""}
                >
                  <TableCell className="font-medium">
                    <span className="ms-2 flex items-center">
                      {apiKey.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <span className="font-mono">
                        {apiKey.key.substring(0, 8)}...
                        {apiKey.key.substring(apiKey.key.length - 4)}
                      </span>
                      <CopyToClipboardButton
                        content={apiKey.key}
                        disabled={isExpired}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>
                    {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}
                  </TableCell>
                  <TableCell>
                    {apiKey.expiresAt ? formatDate(apiKey.expiresAt) : "Never"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="select-none">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="group"
                          disabled={isExpired}
                        >
                          <Copy className="mr-2 size-4 group-hover:scale-105" />
                          Copy Key
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingApiKey(apiKey)}
                          className="group text-destructive focus:text-white"
                        >
                          <Trash className="mr-2 size-4 group-hover:scale-105" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {deletingApiKey && (
        <DeleteApiKeyDialog
          apiKey={deletingApiKey}
          open={!!deletingApiKey}
          onOpenChange={() => setDeletingApiKey(null)}
        />
      )}
    </div>
  );
}
