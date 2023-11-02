import getCurrentUser from "@/server-actions/get-current-user";
import React from "react";

export default async function MyLinks() {
  const user = await getCurrentUser();

  return (
    <>
      <h1>My Links</h1>
      {user.urls
        ? user.urls.map((url: any) => (
            <div key={url.id}>
              <p>{url.shortUrl}</p>
              <p>Original URL: {url.originalUrl}</p>
              {/* <p>Clicks: {url.clicks}</p> */}
            </div>
          ))
        : "No urls"}
    </>
  );
}