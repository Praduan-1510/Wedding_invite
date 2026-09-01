import Shell from '@/components/Shell';
import { events } from '@/lib/invitation';

/** The Kolkata ceremony. This route is the link already in guests' hands —
 *  it does not move. The reception is served at /reception. */
export default function Page() {
  return <Shell event={events.ceremony} />;
}
