import { SVGProps } from "react"
const NextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    color="#6b6b6b"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="none"
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.4}
      d="M7.717 5.093 14.4 12l-6.683 5.438"
    />
  </svg>
)
export default NextIcon
