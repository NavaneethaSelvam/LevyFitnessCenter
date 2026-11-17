import ActionLink from "../components/ActionLink";
import PageMeta from "../components/PageMeta";

export default function NotFoundPage() {
  return (
    <>
      <PageMeta
        title="Page not found"
        description="The page you were looking for could not be found."
      />
      <section className="not-found content-width">
        <p className="eyebrow">404 / Wrong turn</p>
        <h1>
          This page
          <br />
          <em>is off the map.</em>
        </h1>
        <p>Let’s get you back to the training floor.</p>
        <ActionLink to="/">Back to home</ActionLink>
      </section>
    </>
  );
}
