export const metadata = {
  title: "Script Test — LUVEX",
  robots: { index: false, follow: false },
};

export default function ScriptTestPage() {
  return (
    <main id="contenido" style={{ minHeight: "160svh", padding: "140px 6% 120px", background: "#eef0e9", color: "#262825" }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: 32, border: "1px solid #cbd0c5", background: "#f8f7f4" }}>
        <h1 style={{ fontSize: "clamp(34px,5vw,64px)", fontWeight: 400, letterSpacing: "-2px", marginBottom: 20 }}>
          Script loading test
        </h1>
        <p>Esta ruta no depende de React cliente, WebGL ni animaciones.</p>

        <dl style={{ display: "grid", gap: 12, marginTop: 28 }}>
          <div><dt>SSR:</dt><dd id="ssr-status">VISIBLE</dd></div>
          <div><dt>Inline script:</dt><dd id="inline-status">NO</dd></div>
          <div><dt>External same-origin script:</dt><dd id="external-status">NO</dd></div>
          <div><dt>DOM ready:</dt><dd id="dom-status">NO</dd></div>
          <div><dt>Next scripts detected:</dt><dd id="next-scripts">0</dd></div>
          <div><dt>Resource error:</dt><dd id="resource-error">ninguno</dd></div>
          <div><dt>User agent:</dt><dd id="plain-ua">pendiente</dd></div>
        </dl>

        <p style={{ marginTop: "90svh", borderTop: "1px solid #ccd2c3", paddingTop: 20 }}>
          Si llegaste hasta aquí, el scroll HTML funciona.
        </p>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var inline = document.getElementById('inline-status');
                if (inline) inline.textContent = 'YES';

                var ua = document.getElementById('plain-ua');
                if (ua) ua.textContent = navigator.userAgent;

                document.addEventListener('DOMContentLoaded', function () {
                  var dom = document.getElementById('dom-status');
                  if (dom) dom.textContent = 'YES';

                  var scripts = Array.prototype.slice.call(document.scripts || []);
                  var nextCount = scripts.filter(function (s) {
                    return (s.src || '').indexOf('/_next/') !== -1;
                  }).length;
                  var next = document.getElementById('next-scripts');
                  if (next) next.textContent = String(nextCount);
                });

                window.addEventListener('error', function (event) {
                  if (event && event.target && event.target.src) {
                    var target = document.getElementById('resource-error');
                    if (target) target.textContent = String(event.target.src);
                  }
                }, true);
              } catch (error) {
                var target = document.getElementById('resource-error');
                if (target) target.textContent = 'inline error: ' + String(error && error.message ? error.message : error);
              }
            })();
          `,
        }}
      />
      <script src="/lab/client-probe.js" defer />
    </main>
  );
}
