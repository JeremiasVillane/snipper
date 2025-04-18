"use client";

import { useState } from "react";
import { Copy, Key, MoreHorizontal, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import DeleteApiKeyDialog from "./delete-api-key-dialog";
import { toast } from "@/components/ui/simple-toast";
import CreateApiKeyDialog from "./create-api-key-dialog";

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
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No API keys yet</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Create your first API key to get started
        </p>
        <CreateApiKeyDialog>
          <Button className="flex md:hidden">Create API Key</Button>
        </CreateApiKeyDialog>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {apiKey.key.substring(0, 8)}...
                      {apiKey.key.substring(apiKey.key.length - 4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Key
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingApiKey(apiKey)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {deletingApiKey && (
        <DeleteApiKeyDialog
          apiKey={deletingApiKey}
          open={!!deletingApiKey}
          onOpenChange={() => setDeletingApiKey(null)}
        />
      )}
    </>
  );
}
