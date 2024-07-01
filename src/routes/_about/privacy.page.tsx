import type { PageProps } from "rakkasjs"
export default function PrivacyPage({}:PageProps) {
return (
	<div className="w-full h-full  flex flex-col items-center justify-center">
		<div className=" px-4 py-2">
			<h3 className="text-lg font-medium mb-2">Privacy Policy</h3>

			<p className="mb-2">
				This Privacy Policy describes how [Your Liquor Store Name] ("we," "us,"
				or "our") collects, uses, and discloses your personal information when
				you use our website (the "Website").
			</p>

			<p className="mb-2">
				**Information We Collect:** We only collect user data when you
				voluntarily leave a product review. This data may include your username
				or pseudonym (if applicable) and the content of your review.
			</p>

			<p className="mb-2">
				**Use of Personal Information:** We use the information you provide for
				the sole purpose of displaying your review on our website. We do not
				share your personal information with any third parties.
			</p>

			<p className="mb-2">
				**Your Choices:** You have the right to request that we delete your
				review data at any time. You can do so by contacting us through the
				information provided below.
			</p>

			<p className="mb-2">
				**Security:** We take reasonable steps to protect your personal
				information from unauthorized access, disclosure, alteration, or
				destruction. However, no internet transmission is completely secure, and
				we cannot guarantee the security of your information.
			</p>

			<p className="mb-2">
				**Changes to This Privacy Policy:** We may update this Privacy Policy
				from time to time. We will notify you of any changes by posting the new
				Privacy Policy on the Website. You are advised to review this Privacy
				Policy periodically for any changes.
			</p>

			<p className="mb-0">
				**Contact Us:** If you have any questions about this Privacy Policy,
				please contact us at [Your Email Address] or by mail at [Your Address].
			</p>
		</div>
	</div>
);}
