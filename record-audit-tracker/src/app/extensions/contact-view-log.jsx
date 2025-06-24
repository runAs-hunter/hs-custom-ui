import React, { useEffect, useState } from 'react';
import { Card, Heading, Text, List } from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

const ContactVisitCard = (props) => {
  console.log("ContactVisitCard props:", props);
  const { context, runServerless } = props;
  
  // Add safety checks for props
  if (!context || !runServerless) {
    console.error("Missing required props:", { context, runServerless });
    return (
      <Card>
        <Heading>Contact Visit Log</Heading>
        <Text format={{ color: 'critical' }}>Error: Missing required data</Text>
      </Card>
    );
  }

  const contactId = context.crm?.objectId;
  const userId = context.user?.id;
  const userEmail = context.user?.email;
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  console.log("ContactVisitCard context:", {
    contactId,
    userId,
    userEmail,
    context: context
  });

  useEffect(() => {
    if (!contactId || !userId || !userEmail) {
      const errorMsg = `Missing required data: contactId=${contactId}, userId=${userId}, userEmail=${userEmail}`;
      console.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    const logVisit = async () => {
      try {
        console.log("Calling capture-visit serverless function...");
        setDebugInfo(prev => prev + "\nCalling capture-visit...");
        
        // 1) Log this visit
        const result = await runServerless({
          name: "capture-visit",
          parameters: { contactId, userId, userEmail }
        });
        
        console.log("capture-visit result:", result);
        setDebugInfo(prev => prev + "\ncapture-visit completed: " + JSON.stringify(result));
      } catch (err) {
        console.error("Failed to log visit:", err);
        setDebugInfo(prev => prev + "\ncapture-visit error: " + err.message);
        // Don't set error here as this is not critical for display
      }
    };

    const fetchVisits = async () => {
      try {
        console.log("Calling get-visits serverless function...");
        setDebugInfo(prev => prev + "\nCalling get-visits...");
        
        // 2) Fetch all visits
        const res = await runServerless({
          name: "get-visits",
          parameters: { contactId }
        });
        
        console.log("get-visits result:", res);
        setDebugInfo(prev => prev + "\nget-visits completed: " + JSON.stringify(res));
        
        setError(null);
        // Ensure visits is always an array
        setVisits(Array.isArray(res.response) ? res.response : []);
      } catch (err) {
        console.error("Failed to fetch visits:", err);
        setDebugInfo(prev => prev + "\nget-visits error: " + err.message);
        setError(err?.body?.error || err.message || "Failed to load visits");
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    logVisit();
    fetchVisits();
  }, [contactId, userId, userEmail, runServerless]);

  let content;
  if (loading) {
    content = <Text>Loading visit history...</Text>;
  } else if (error) {
    content = <Text format={{ color: 'critical' }}>Error: {error}</Text>;
  } else if (!visits || visits.length === 0) {
    content = <Text>No visits recorded yet.</Text>;
  } else {
    content = (
      <List>
        {visits.map((visit, index) => (
          <Text key={`${visit.timestamp}-${visit.email}-${index}`}>
            {visit.email || 'Unknown'} @ {new Date(visit.timestamp).toLocaleString()}
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
      {debugInfo && (
        <Text format={{ size: 'xs', color: 'muted' }}>
          Debug: {debugInfo}
        </Text>
      )}
    </Card>
  );
};

export default ContactVisitCard;

hubspot.extend(({ runServerlessFunction, context }) => (
  <ContactVisitCard runServerless={runServerlessFunction} context={context} />
));
