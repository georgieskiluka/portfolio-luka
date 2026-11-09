import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import {
  EndorsementFace,
  SANS,
  SERIF,
  starsFor,
} from "@/components/portfolio/parts";
import { endorsements as cardSlots } from "@/content/portfolio";
import {
  adminPasswordConfigured,
  isAdmin,
} from "@/lib/endorsements/admin-auth";
import {
  listEndorsements,
  storeConfigured,
  type StoredEndorsement,
} from "@/lib/endorsements/store";
import { approve, login, logout, reject, unpublish } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Endorsements admin",
  robots: { index: false, follow: false },
};

const page: CSSProperties = {
  minHeight: "100vh",
  boxSizing: "border-box",
  padding: "clamp(24px, 5vw, 56px) clamp(16px, 5vw, 56px)",
  fontFamily: SANS,
};
const title: CSSProperties = {
  fontFamily: SERIF,
  fontSize: "clamp(32px, 5vw, 48px)",
  fontWeight: 600,
  letterSpacing: "-0.025em",
  margin: 0,
};
const sectionTitle: CSSProperties = {
  fontFamily: SERIF,
  fontSize: 26,
  fontWeight: 600,
  margin: "48px 0 20px",
};
const LOGIN_ERRORS: Record<string, string> = {
  wrong: "That password is not right.",
  locked: "Too many attempts. Wait 15 minutes and try again.",
};

function Notice({ children }: { children: ReactNode }) {
  return (
    <main style={page}>
      <h1 style={title}>Endorsements</h1>
      <p style={{ marginTop: 16 }}>{children}</p>
    </main>
  );
}

function ActionForm({
  action,
  id,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}

function Card({
  endorsement,
  note,
  children,
}: {
  endorsement: StoredEndorsement;
  note: string;
  children: ReactNode;
}) {
  const date = new Date(endorsement.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <li style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <EndorsementFace
        endorsement={endorsement}
        stars={starsFor(endorsement.rating)}
        ratingLabel={`${endorsement.rating} out of 5`}
      />
      <p style={{ margin: 0, fontSize: 14 }}>
        Received {date}. {note}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {children}
      </div>
    </li>
  );
}

function CardList({ children }: { children: ReactNode }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: 32,
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
        alignItems: "start",
      }}
    >
      {children}
    </ul>
  );
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!storeConfigured || !adminPasswordConfigured) {
    return (
      <Notice>
        Setup isn&apos;t finished: connect Upstash Redis and set ADMIN_PASSWORD
        in the Vercel project.
      </Notice>
    );
  }

  if (!(await isAdmin())) {
    const { error } = await searchParams;
    const message = typeof error === "string" ? LOGIN_ERRORS[error] : undefined;
    return (
      <main style={{ ...page, maxWidth: 440, margin: "0 auto" }}>
        <h1 style={title}>Endorsements</h1>
        <form
          action={login}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 28,
          }}
        >
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="pf-admin-input"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-describedby={message ? "login-error" : undefined}
          />
          {message && (
            <p id="login-error" role="alert" style={{ margin: 0 }}>
              {message}
            </p>
          )}
          <button type="submit" className="pf-admin-btn pf-admin-btn-primary">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  const { pending, approved } = await listEndorsements();

  return (
    <main style={page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <h1 style={title}>Endorsements</h1>
        <form action={logout}>
          <button type="submit" className="pf-admin-btn">
            Sign out
          </button>
        </form>
      </div>

      <h2 style={sectionTitle}>Waiting for approval ({pending.length})</h2>
      {pending.length === 0 ? (
        <p>Nothing is waiting for you.</p>
      ) : (
        <CardList>
          {pending.map((e) => (
            <Card key={e.id} endorsement={e} note="Not on the site yet.">
              <ActionForm
                action={approve}
                id={e.id}
                className="pf-admin-btn pf-admin-btn-primary"
              >
                Approve
              </ActionForm>
              <details>
                <summary className="pf-admin-btn">Reject</summary>
                <div style={{ marginTop: 10 }}>
                  <ActionForm
                    action={reject}
                    id={e.id}
                    className="pf-admin-btn"
                  >
                    Yes, delete it for good
                  </ActionForm>
                </div>
              </details>
            </Card>
          ))}
        </CardList>
      )}

      <h2 style={sectionTitle}>Approved ({approved.length})</h2>
      {approved.length > cardSlots.length && (
        <p style={{ marginTop: 0 }}>
          The site has {cardSlots.length} cards, so only the {cardSlots.length}{" "}
          most recently approved are showing.
        </p>
      )}
      {approved.length === 0 ? (
        <p>None yet. Approved endorsements appear on the site&apos;s cards.</p>
      ) : (
        <CardList>
          {approved.map((e, i) => (
            <Card
              key={e.id}
              endorsement={e}
              note={
                i < cardSlots.length
                  ? "On the site."
                  : "Not showing: no free card."
              }
            >
              <ActionForm action={unpublish} id={e.id} className="pf-admin-btn">
                Take off the site
              </ActionForm>
            </Card>
          ))}
        </CardList>
      )}
    </main>
  );
}
