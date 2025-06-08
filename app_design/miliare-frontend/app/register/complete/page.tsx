import Link from 'next/link'

export default function RegistrationComplete() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-6 space-y-6 bg-primary-light">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Almost there!</h1>
        <p className="text-gray-600">Please complete the following DocuSign forms to finish your registration.</p>
        <ul className="list-disc list-inside text-left space-y-2">
          <li>
            <Link href="#" className="text-primary hover:underline">
              1099‑NEC Form
            </Link>
          </li>
          <li>
            <Link href="#" className="text-primary hover:underline">
              Direct Deposit Form
            </Link>
          </li>
        </ul>
        <Link href="/dashboard/business" className="text-primary font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
