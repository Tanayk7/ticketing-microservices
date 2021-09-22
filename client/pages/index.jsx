import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets && tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    console.log("Landing page getinitialprops called!!");
    
    const response = await client.get('/api/tickets').catch(err => console.log(err));

    console.log("Response from server: ", response.data);

    return { tickets: response.data };
};

export default LandingPage;
