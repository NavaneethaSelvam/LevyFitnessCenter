import Image from "next/image";
import Link from "next/link";

export default function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Levy Fitness Center home">
      <Image
        className="brand__mark"
        src="/images/branding/levy-mark.svg"
        alt=""
        width={72}
        height={56}
        priority
      />
      <span className="brand__name">
        <strong>LEVY</strong>
        <span>FITNESS CENTER</span>
      </span>
    </Link>
  );
}
