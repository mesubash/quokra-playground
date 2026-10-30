import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Check, Headset } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
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

const highlights = [
  "Sign in as a customer to chat with support",
  "Sign in as an agent to answer from the Support page",
  "Open both in two windows to see it live",
]

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    enter(customerFromEmail(String(new FormData(e.currentTarget).get("email"))))
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-muted p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Logo size={24} />
          </div>
          Quokra Playground
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            A realistic admin UI to test your ideas against
          </h2>
          <ul className="mt-8 space-y-3 text-muted-foreground">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="size-4 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          Playground login: customers use any email; agents pick a demo agent.
        </p>
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
              <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Logo size={24} />
              </div>
              Quokra Playground
            </Link>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in as a customer or a support agent
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
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            defaultValue="playground"
                            required
                          />
                        </Field>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={pending}
                        >
                          {pending ? "Signing in…" : "Sign in"}
                        </Button>
                      </FieldGroup>
                    </form>
                  </TabsContent>
                  <TabsContent value="agent">
                    <div className="grid gap-2">
                      {DEMO_AGENTS.map((agent) => (
                        <Button
                          key={agent.email}
                          variant="outline"
                          className="h-auto justify-start gap-3 py-3"
                          disabled={pending}
                          onClick={() => enter(agent)}
                        >
                          <Headset className="size-4" aria-hidden />
                          <span className="flex flex-col items-start">
                            <span className="font-medium">
                              Sign in as {agent.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {agent.email}
                            </span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-balance text-muted-foreground lg:hidden">
              Playground login: customers use any email; agents pick a demo
              agent.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
