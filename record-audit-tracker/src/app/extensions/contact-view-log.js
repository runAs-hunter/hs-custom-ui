import React, { useEffect, useState } from 'react';
import { Card, Heading, Text, List } from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

const ContactVisitCard = (props) => {
  console.log("ContactVisitCard props:", props);
  const { context, runServerless } = props;
  const contactId = context.crm.objectId;
  const userId = context.user.id;
  const userEmail = context.user.email;
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Log this visit
    runServerless({
      name: "capture-visit",
      parameters: { contactId, userId, userEmail }
    }).catch(console.error);

    // 2) Fetch all visits
    runServerless({
      name: "get-visits",
      parameters: { contactId }
    })
      .then(res => {
        setError(null);
        setVisits(res.response || []);
      })
      .catch(err => {
        setError(err?.body?.error || err.message || "Failed to load visits");
        setVisits([]);
      });
  }, [contactId, userId, userEmail, runServerless]);

  let content;
  if (error) {
    content = <Text format={{ color: 'critical' }}>Error: {error}</Text>;
  } else if (visits.length === 0) {
    content = <Text>No visits yet.</Text>;
  } else {
    content = (
      <List>
        {visits.map((visit) => (
          <Text key={`${visit.timestamp}-${visit.email}`}>
            {visit.email} @ {new Date(visit.timestamp).toLocaleString()}
          </Text>
        ))}
      </List>
    );
  }

  return (
    <Card>
      <Heading>
        Contact Visit Log
      </Heading>
      {content}
    </Card>
  );
};

export default ContactVisitCard;

hubspot.extend(({ runServerlessFunction, context }) => (
  <ContactVisitCard runServerless={runServerlessFunction} context={context} />
));
