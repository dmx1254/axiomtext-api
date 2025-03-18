"use client";

import {
  MessageSquare,
  KeyRound,
  Zap,
  Code2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useScopedI18n } from "@/locales/client";

const CodeBlock = ({
  language,
  children,
}: {
  language: string;
  children: string | string[];
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      typeof children === "string" ? children : children.join("\n")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={copyToClipboard}
        >
          {copied ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="bg-zinc-950 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 text-sm text-zinc-400 px-4 py-2 bg-zinc-900/50">
          <Code2 className="h-4 w-4" />
          <span>{language}</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={{
              ...vscDarkPlus,
              'pre[class*="language-"]': {
                ...vscDarkPlus['pre[class*="language-"]'],
                background: "transparent",
                margin: 0,
                padding: 0,
              },
              'code[class*="language-"]': {
                ...vscDarkPlus['code[class*="language-"]'],
                background: "transparent",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                color: "#e4e4e7", // zinc-200
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              },
              comment: {
                ...vscDarkPlus.comment,
                color: "#71717a", // zinc-500
              },
              string: {
                ...vscDarkPlus.string,
                color: "#4ade80", // green-400
              },
              number: {
                ...vscDarkPlus.number,
                color: "#60a5fa", // blue-400
              },
              function: {
                ...vscDarkPlus.function,
                color: "#f472b6", // pink-400
              },
              keyword: {
                ...vscDarkPlus.keyword,
                color: "#c084fc", // purple-400
              },
            }}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
            }}
          >
            {typeof children === "string" ? children : children.join("\n")}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

interface ResponseExampleProps {
  status: number;
  response: {
    success?: boolean;
    message?: string;
    error?: string;
    status?: number;
    data?: Record<string, unknown>;
    remainingCredits?: number;
  };
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const ResponseExample = ({ status, response }: ResponseExampleProps) => (
  <div className="space-y-3 overflow-x-auto">
    <div className="flex items-center gap-2 px-1">
      {status >= 200 && status < 300 ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
      )}
      <span className="font-mono text-base font-medium">Status: {status}</span>
    </div>
    <CodeBlock language="json">{JSON.stringify(response, null, 2)}</CodeBlock>
  </div>
);

export function DocsContent() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [expandedSections, setExpandedSections] = useState<string[]>(["quickstart"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const tScope = useScopedI18n("docs");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const mainSection = sectionId.includes('-') ? sectionId.split('-')[0] : sectionId;
            
            setActiveSection(sectionId);
            setExpandedSections((prev) => 
              prev.includes(mainSection) ? prev : [...prev, mainSection]
            );
          }
        });
      },
      { threshold: 0.2, rootMargin: '-20% 0px -20% 0px' }
    );

    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background font-firecode">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XCircle className="h-6 w-6" />
        ) : (
          <ChevronRight className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-[3.5rem] 
        w-[280px] lg:w-64 
        h-[calc(100vh-3.5rem)]
        border-r border-border
        bg-card/50 backdrop-blur-sm
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40
        overflow-y-auto
      `}>
        <div className="py-6 px-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Documentation
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {tScope("title")}
            </p>
          </div>

          <nav className="space-y-1">
            {[
              {
                id: "quickstart",
                icon: Zap,
                label: tScope("quickstart"),
                subsections: [
                  { id: "premiers-pas", label: tScope("getAPIKey") },
                  { id: "first-sms", label: tScope("sendSMS") },
                  {
                    id: "configuration",
                    label: tScope("subsections.configuration"),
                  },
                ],
              },
              {
                id: "authentication",
                icon: KeyRound,
                label: tScope("authentication"),
                subsections: [
                  { id: "tokens", label: tScope("authHeader") },
                  { id: "headers", label: tScope("rateLimitsHeaders") },
                  { id: "errors", label: tScope("commonErrorCodes") },
                ],
              },
              {
                id: "messages",
                icon: MessageSquare,
                label: tScope("messages"),
                subsections: [
                  { id: "send", label: tScope("sendSMS") },
                  { id: "otp", label: tScope("sendOTP") },
                  { id: "verify", label: tScope("verifyOTP") },
                ],
              },
              {
                id: "errors",
                icon: AlertTriangle,
                label: tScope("errors"),
                subsections: [
                  { id: "codes", label: tScope("commonErrorCodes") },
                  { id: "handling", label: tScope("subsections.handling") },
                  { id: "examples", label: tScope("subsections.examples") },
                ],
              },
              {
                id: "rate-limits",
                icon: Clock,
                label: tScope("rateLimits"),
                subsections: [
                  { id: "general", label: tScope("generalLimits") },
                  { id: "otp", label: tScope("otpLimits") },
                  { id: "headers", label: tScope("rateLimitsHeaders") },
                ],
              },
            ].map(({ id, icon: Icon, label, subsections }) => (
              <div key={id} className="space-y-1">
                <button
                  onClick={() => toggleSection(id)}
                  className={classNames(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                    activeSection === id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {expandedSections.includes(id) ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>

                {expandedSections.includes(id) && (
                  <div className="ml-6 space-y-1">
                    {subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() =>
                          scrollToSection(`${id}-${subsection.id}`)
                        }
                        className={classNames(
                          "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                          activeSection === `${id}-${subsection.id}`
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {subsection.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-[calc(100vh-3.5rem)]">
        <div className="w-full mx-auto px-4 lg:px-8 py-6">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {/* Hero Section */}
            <div className="mb-12 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                {tScope("title")}
              </h1>
              <p className="text-xl text-muted-foreground">
                {tScope("description")}
              </p>
            </div>

            {/* Quick Start Section */}
            <section id="quickstart" className="space-y-8">
              <h1 className="text-3xl font-bold">{tScope("quickstart")}</h1>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{tScope("getAPIKey")}</h2>
                <p className="text-muted-foreground">{tScope("getAPIKeyDesc")}</p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>{tScope("loginDashboard")}</li>
                  <li>{tScope("accessSettings")}</li>
                  <li>{tScope("accessAPI")}</li>
                  <li>{tScope("generateToken")}</li>
                  <li>
                    <strong>{tScope("important")}</strong>{" "}
                    {tScope("tokenVisibility")}
                  </li>
                </ol>
              </div>
            </section>

            {/* Authentication Section */}
            <section id="authentication" className="space-y-8">
              <h2 className="text-2xl font-semibold">
                {tScope("authentication")}
              </h2>

              <div className="space-y-4">
                <p className="text-muted-foreground">{tScope("authDesc")}</p>

                <h3 className="text-xl font-semibold">{tScope("authHeader")}</h3>
                <CodeBlock language="bash">
                  Authorization: Bearer votre_token_ici
                </CodeBlock>

                <div className="mt-4">
                  <h3 className="text-xl font-semibold">
                    {tScope("authLimits")}
                  </h3>
                  <p className="text-muted-foreground">
                    {tScope("authLimitsDesc")}
                  </p>
                  <CodeBlock language="bash">{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: nombre_restant
X-RateLimit-Reset: timestamp_reset
Retry-After: secondes_avant_prochain_essai # (uniquement si limite dépassée)`}</CodeBlock>
                </div>
              </div>
            </section>

            {/* Messages Section */}
            <section id="messages" className="space-y-8">
              <h2 className="text-2xl font-semibold">{tScope("messages")}</h2>

              <div className="space-y-8">
                <div id="messages-send" className="space-y-4">
                  <h3 className="text-xl font-semibold">{tScope("sendSMS")}</h3>
                  <p className="text-muted-foreground">{tScope("sendSMSDesc")}</p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{tScope("endpoint")}</h4>
                    <CodeBlock language="bash">POST /api/sms/message</CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("parameters")}
                    </h4>
                    <CodeBlock language="json">{`{
  "to": "+221xxxxxxxxx",
  "message": "Votre message",
  "signature": "Nom de la société" // Optionnel, utilise le nom de la société par défaut
}`}</CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("codeExamples")}
                    </h4>
                    <Tabs defaultValue="curl" className="space-y-4">
                      <TabsList className="bg-muted/50">
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="php">PHP</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlock language="bash">{`curl -X POST https://api.axiomtext.com/api/sms/message \\
  -H "Authorization: Bearer votre_token_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+221xxxxxxxxx",
    "message": "Votre message",
    "signature": "MaSociete"
  }'`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlock language="javascript">{`const API_TOKEN = 'votre_token_api';
const API_URL = 'https://api.axiomtext.com/api';

async function sendSMS(to, message, signature = 'MaSociete') {
  try {
    const response = await fetch(\`\${API_URL}/sms/message\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message, signature })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\\'envoi:', error);
    throw error;
  }
}

// Exemple d'utilisation
sendSMS(
  '+221xxxxxxxxx',
  'Votre message'
).then(console.log).catch(console.error);`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="php">
                        <CodeBlock language="php">{`<?php
$apiToken = 'votre_token_api';
$apiUrl = 'https://api.axiomtext.com/api';

function sendSMS($to, $message, $signature = 'MaSociete') {
    global $apiToken, $apiUrl;
    
    $data = [
        'to' => $to,
        'message' => $message,
        'signature' => $signature
    ];
    
    $ch = curl_init("$apiUrl/sms/message");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de l'envoi: $error");
    }
    
    return json_decode($response, true);
}

// Exemple d'utilisation
try {
    $result = sendSMS(
        '+221xxxxxxxxx',
        'Votre message'
    );
    print_r($result);
} catch (Exception $e) {
    echo $e->getMessage();
}`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlock language="python">{`import requests

API_TOKEN = 'votre_token_api'
API_URL = 'https://api.axiomtext.com/api'

def send_sms(to, message, signature='MaSociete'):
    """
    Envoie un SMS via l'API.
    
    Args:
        to (str): Numéro de téléphone du destinataire
        message (str): Contenu du message
        signature (str, optional): Signature de l'expéditeur
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/message",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'to': to,
                'message': message,
                'signature': signature
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi: {e}")
        raise

# Exemple d'utilisation
try:
    result = send_sms(
        '+221xxxxxxxxx',
        'Votre message'
    )
    print(result)
except Exception as e:
    print(f"Erreur: {e}")`}</CodeBlock>
                      </TabsContent>
                    </Tabs>

                    <h4 className="text-lg font-medium">{tScope("responses")}</h4>
                    <div className="space-y-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "SMS envoyé avec succès",
                          data: {
                            messageId: "123456789",
                            remainingCredits: 999,
                            cost: 1,
                            status: "sent",
                          },
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Numéro de téléphone et message requis",
                          status: 400,
                        }}
                      />
                      <ResponseExample
                        status={403}
                        response={{
                          error: "Crédits SMS insuffisants",
                          status: 403,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div id="messages-otp" className="space-y-4">
                  <h3 className="text-xl font-semibold">{tScope("sendOTP")}</h3>
                  <p className="text-muted-foreground">{tScope("sendOTPDesc")}</p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{tScope("endpoint")}</h4>
                    <CodeBlock language="bash">POST /api/sms/otp/send</CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("parameters")}
                    </h4>
                    <CodeBlock language="json">{`{
  "phone": "+221xxxxxxxxx",
  "signature": "Nom de la compagnie" // Optionnel
}`}</CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("codeExamples")}
                    </h4>
                    <Tabs defaultValue="curl" className="space-y-4">
                      <TabsList className="bg-muted/50">
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="php">PHP</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlock language="bash">{`curl -X POST https://api.axiomtext.com/api/sms/otp/send \\
  -H "Authorization: Bearer votre_token_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+221xxxxxxxxx",
    "signature": "MaSociete"
  }'`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlock language="javascript">{`const API_TOKEN = 'votre_token_api';
const API_URL = 'https://api.axiomtext.com/api';

async function sendOTP(phone, signature = 'MaSociete') {
  try {
    const response = await fetch(\`\${API_URL}/sms/otp/send\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, signature })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\\'envoi:', error);
    throw error;
  }
}

// Exemple d'utilisation
sendOTP('+221xxxxxxxxx').then(console.log).catch(console.error);`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="php">
                        <CodeBlock language="php">{`<?php
$apiToken = 'votre_token_api';
$apiUrl = 'https://api.axiomtext.com/api';

function sendOTP($phone, $signature = 'MaSociete') {
    global $apiToken, $apiUrl;
    
    $data = [
        'phone' => $phone,
        'signature' => $signature
    ];
    
    $ch = curl_init("$apiUrl/sms/otp/send");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de l'envoi: $error");
    }
    
    return json_decode($response, true);
}

// Exemple d'utilisation
try {
    $result = sendOTP('+221xxxxxxxxx');
    print_r($result);
} catch (Exception $e) {
    echo $e->getMessage();
}`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlock language="python">{`import requests

API_TOKEN = 'votre_token_api'
API_URL = 'https://api.axiomtext.com/api'

def send_otp(phone, signature='MaSociete'):
    """
    Envoie un code OTP via l'API.
    
    Args:
        phone (str): Numéro de téléphone du destinataire
        signature (str, optional): Signature de l'expéditeur
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/otp/send",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'phone': phone,
                'signature': signature
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi: {e}")
        raise

# Exemple d'utilisation
try:
    result = send_otp('+221xxxxxxxxx')
    print(result)
except Exception as e:
    print(f"Erreur: {e}")`}</CodeBlock>
                      </TabsContent>
                    </Tabs>

                    <h4 className="text-lg font-medium">{tScope("responses")}</h4>
                    <div className="space-y-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "Code OTP envoyé avec succès",
                          remainingCredits: 999,
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Numéro de téléphone requis",
                          status: 400,
                        }}
                      />
                      <ResponseExample
                        status={403}
                        response={{
                          error: "Solde insuffisant",
                          status: 403,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div id="messages-verify" className="space-y-4">
                  <h3 className="text-xl font-semibold">{tScope("verifyOTP")}</h3>
                  <p className="text-muted-foreground">
                    {tScope("verifyOTPDesc")}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{tScope("endpoint")}</h4>
                    <CodeBlock language="bash">
                      POST /api/sms/otp/verify
                    </CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("parameters")}
                    </h4>
                    <CodeBlock language="json">{`{
  "phone": "+221xxxxxxxxx",
  "code": "123456"
}`}</CodeBlock>

                    <h4 className="text-lg font-medium">
                      {tScope("codeExamples")}
                    </h4>
                    <Tabs defaultValue="curl" className="space-y-4">
                      <TabsList className="bg-muted/50">
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="php">PHP</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl">
                        <CodeBlock language="bash">{`curl -X POST https://api.axiomtext.com/api/sms/otp/verify \\
  -H "Authorization: Bearer votre_token_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+221xxxxxxxxx",
    "code": "123456"
  }'`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="javascript">
                        <CodeBlock language="javascript">{`const API_TOKEN = 'votre_token_api';
const API_URL = 'https://api.axiomtext.com/api';

async function verifyOTP(phone, code) {
  try {
    const response = await fetch(\`\${API_URL}/sms/otp/verify\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    throw error;
  }
}

// Exemple d'utilisation
verifyOTP('+221xxxxxxxxx', '123456').then(console.log).catch(console.error);`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="php">
                        <CodeBlock language="php">{`<?php
$apiToken = 'votre_token_api';
$apiUrl = 'https://api.axiomtext.com/api';

function verifyOTP($phone, $code) {
    global $apiToken, $apiUrl;
    
    $data = [
        'phone' => $phone,
        'code' => $code
    ];
    
    $ch = curl_init("$apiUrl/sms/otp/verify");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de la vérification: $error");
    }
    
    return json_decode($response, true);
}

// Exemple d'utilisation
try {
    $result = verifyOTP('+221xxxxxxxxx', '123456');
    print_r($result);
} catch (Exception $e) {
    echo $e->getMessage();
}`}</CodeBlock>
                      </TabsContent>
                      <TabsContent value="python">
                        <CodeBlock language="python">{`import requests

API_TOKEN = 'votre_token_api'
API_URL = 'https://api.axiomtext.com/api'

def verify_otp(phone, code):
    """
    Vérifie un code OTP via l'API.
    
    Args:
        phone (str): Numéro de téléphone
        code (str): Code OTP à vérifier
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/otp/verify",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'phone': phone,
                'code': code
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la vérification: {e}")
        raise

# Exemple d'utilisation
try:
    result = verify_otp('+221xxxxxxxxx', '123456')
    print(result)
except Exception as e:
    print(f"Erreur: {e}")`}</CodeBlock>
                      </TabsContent>
                    </Tabs>

                    <h4 className="text-lg font-medium">{tScope("responses")}</h4>
                    <div className="space-y-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "Code OTP vérifié avec succès",
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Code OTP expiré ou invalide",
                          status: 400,
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Code OTP incorrect",
                          status: 400,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Errors Section */}
            <section id="errors" className="space-y-8">
              <h2 className="text-2xl font-semibold">{tScope("errors")}</h2>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {tScope("commonErrorCodes")}
                </h3>
                <div className="space-y-4">
                  <ResponseExample
                    status={401}
                    response={{
                      error: "Token d'authentification manquant",
                    }}
                  />
                  <ResponseExample
                    status={429}
                    response={{
                      error: "Limite de requêtes dépassée pour cette IP",
                    }}
                  />
                  <ResponseExample
                    status={403}
                    response={{
                      error: "Crédits SMS insuffisants",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Rate Limits Section */}
            <section id="rate-limits" className="space-y-8">
              <h2 className="text-2xl font-semibold">{tScope("rateLimits")}</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {tScope("generalLimits")}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>{tScope("rateLimitsIP")}</li>
                      <li>{tScope("rateLimitsUser")}</li>
                      <li>{tScope("rateLimitsReset")}</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {tScope("otpLimits")}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>{tScope("otpValidity")}</li>
                      <li>{tScope("otpFormat")}</li>
                      <li>{tScope("otpSingleCode")}</li>
                    </ul>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {tScope("rateLimitsHeaders")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {tScope("rateLimitsUsage")}
                  </p>
                  <CodeBlock language="json">{`{
  "X-RateLimit-Limit": "1000",
  "X-RateLimit-Remaining": "999",
  "X-RateLimit-Reset": "1625097600000",
  "Retry-After": "3600" // Uniquement si limite dépassée
}`}</CodeBlock>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
