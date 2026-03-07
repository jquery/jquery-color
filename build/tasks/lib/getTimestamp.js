export default function getTimestamp() {
	const now = new Date();
	const hours = String( now.getHours() ).padStart( 2, "0" );
	const minutes = String( now.getMinutes() ).padStart( 2, "0" );
	const seconds = String( now.getSeconds() ).padStart( 2, "0" );
	const ms = String( now.getMilliseconds() ).padStart( 3, "0" );
	return `${ hours }:${ minutes }:${ seconds }.${ ms }`;
}
