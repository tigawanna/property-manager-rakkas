import type { PageProps } from "rakkasjs"
export default function LegalPage({}:PageProps) {
return (
	<div className="w-full h-full  flex flex-col items-center justify-center">
		<div className=" px-4 py-2 text-balance">
			<h3 className="text-2xl font-medium mb-2 text-center">Legal Disclaimer</h3>

			<p className="mb-2">
				<h2 className="font-bold">Alcohol Consumption</h2> Age Restriction: You
				must be 18 years of age or older to access this website. By using this
				website, you represent and warrant that you are of legal age to purchase
				alcoholic beverages.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">Alcohol Consumption</h2> This website is
				intended for informational purposes only. We do not promote
				irresponsible or underage drinking. Please consume alcohol responsibly
				and in accordance with Kenyan law.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">Financial Transactions</h2> This website does
				not handle financial transactions directly. All purchases are
				facilitated through secure third-party payment vendors. We are not
				responsible for any issues arising from these transactions.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">Delivery</h2> We rely on independent delivery
				networks to fulfill orders. We are not responsible for any delays or
				damages incurred during the delivery process.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">Delivery Limitation</h2> of Liability We make
				every effort to ensure the accuracy of information on this website.
				However, we are not liable for any errors or omissions. You agree to use
				this website at your own risk. We are not responsible for any loss of
				funds resulting from the use of this website.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">User Data</h2> We only collect user data when
				you voluntarily leave a product review. This data is not shared with any
				third parties. We take user privacy seriously and implement appropriate
				measures to protect your information.
			</p>

			<p className="mb-2">
				<h2 className="font-bold">Changes to Disclaimer</h2> We reserve the
				right to modify this disclaimer at any time without prior notice.
			</p>

			<p className="mb-0">
				<h2 className="font-bold">Governing Law</h2> This disclaimer is
				governed by and construed in accordance with the laws of Kenya.
			</p>

			<p className="mb-0">
				<h2 className="font-bold">Dispute Resolution</h2> Any dispute arising
				out of or relating to this disclaimer shall be settled by the courts of
				Kenya.
			</p>
		</div>
	</div>
);}
