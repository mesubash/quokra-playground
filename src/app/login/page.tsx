import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Headset } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  customerFromEmail,
  DEMO_AGENTS,
  signIn,
  type SessionUser,
} from "@/lib/auth"
import { oidc } from "@/lib/oidc"

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(false)

  function enter(user: SessionUser) {
    setPending(true)
    signIn(user)
    const next = params.get("next")
    const fallback = user.role === "agent" ? "/support" : "/dashboard"
    // Only follow same-app paths, never "//host" or absolute URLs
    navigate(
      next?.startsWith("/") && !next.startsWith("//") ? next : fallback,
      {
        replace: true,
      }
    )
  }

  // Agents sign in at the identity provider; it sends them back to /auth/callback.
  function agentSignIn(username: string) {
    setPending(true)
    void oidc
      .signinRedirect({
        login_hint: username,
        state: { next: params.get("next") },
      })
      .catch(() => setPending(false))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    enter(customerFromEmail(String(new FormData(e.currentTarget).get("email"))))
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col gap-10 overflow-hidden bg-muted p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Logo size={36} />
          Quokra Playground
        </Link>
        <div className="my-auto">
          <h2 className="max-w-md text-3xl font-bold tracking-tight text-balance">
            See both sides of one conversation
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Customers chat from the dashboard. Agents answer from the Support
            page, with the whole history in front of them.
          </p>
          <figure className="mt-10">
            <img
              src="/screens/agent-console.jpg"
              alt="The Quokra agent console with Sam's chats and a conversation he joined."
              width={1312}
              height={582}
              className="h-auto w-full rounded-xl border shadow-sm dark:hidden"
            />
            <img
              src="/screens/agent-console-dark.jpg"
              alt="The Quokra agent console with Sam's chats and a conversation he joined."
              width={1312}
              height={582}
              className="hidden h-auto w-full rounded-xl border shadow-sm dark:block"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">
              What Sam sees on the Support page.
            </figcaption>
          </figure>
        </div>
      </aside>

      <main className="flex flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to="/" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to home
          </Button>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 self-center font-semibold lg:hidden"
            >
              <Logo size={36} />
              Quokra Playground
            </Link>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Try the demo</CardTitle>
                <CardDescription>
                  No account needed. Pick a side.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customer">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                    <TabsTrigger value="agent">Support agent</TabsTrigger>
                  </TabsList>
                  <TabsContent value="customer">
                    <form onSubmit={onSubmit}>
                      <FieldGroup className="grid gap-4">
                        <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            defaultValue="pat@example.test"
                            required
                          />
                          <FieldDescription>
                            Any email works. You'll land on the dashboard with
                            the chat in the corner.
                          </FieldDescription>
                        </Field>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={pending}
                        >
                          {pending ? "Signing in…" : "Continue as customer"}
                        </Button>
                      </FieldGroup>
                    </form>
                  </TabsContent>
                  <TabsContent value="agent">
                    <p className="mb-3 text-sm text-muted-foreground">
                      Answer chats from the Support page. You sign in on the
                      real login page (Keycloak).
                    </p>
                    <div className="grid gap-2">
                      {DEMO_AGENTS.map((agent) => (
                        <Button
                          key={agent.username}
                          variant="outline"
                          className="h-auto justify-start gap-3 py-3"
                          disabled={pending}
                          onClick={() => agentSignIn(agent.username)}
                        >
                          <Headset className="size-4" aria-hidden />
                          <span className="flex flex-col items-start">
                            <span className="font-medium">
                              Sign in as {agent.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Password: {agent.password}
                            </span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <p className="text-center text-sm text-balance text-muted-foreground">
              To see both sides at once, sign in as an agent in a private
              window.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
