import { NextResponse } from "next/server";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function createTopLevelRedirectResponse(destination: URL) {
  const url = destination.toString();
  const htmlUrl = escapeHtml(url);

  return new NextResponse(
    `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0;url=${htmlUrl}">
  <title>Weiterleitung</title>
</head>
<body>
  <script>
    (function () {
      var target = ${JSON.stringify(url)};
      try {
        window.parent.postMessage({ type: "CVOLUTION_NAVIGATE_TOP", url: target }, "https://analyse.cvolution.ch");
      } catch (error) {}
      try {
        if (window.top && window.top !== window.self) {
          window.top.location.replace(target);
          return;
        }
      } catch (error) {}
      window.location.replace(target);
    })();
  </script>
  <a href="${htmlUrl}" target="_top" rel="noreferrer">Weiter</a>
</body>
</html>`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
