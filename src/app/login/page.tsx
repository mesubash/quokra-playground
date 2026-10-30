import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
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
import { signIn } from "@/lib/auth"

const highlights = [
  "Dashboard with charts and a data table",
  "Users, Mail and Chat apps",
  "Settings, command search and dark mode",
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    signIn(String(new FormData(e.currentTarget).get("email")))
    const next = params.get("next")
    // Only follow same-app paths, never "//host" or absolute URLs
    navigate(
      next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard",
      {
        replace: true,
      }
    )
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
          Playground login: any email and password works.
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
                <CardDescription>Sign in to open the dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit}>
                  <FieldGroup className="grid gap-4">
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        defaultValue="admin@quokra.dev"
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
                    <Button type="submit" className="w-full" disabled={pending}>
                      {pending ? "Signing in…" : "Sign in"}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-balance text-muted-foreground lg:hidden">
              Playground login: any email and password works.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
