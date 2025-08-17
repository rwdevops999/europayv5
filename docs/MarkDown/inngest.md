# Inngest

Defines workflows for background jobs.

## functions

Functions are the jobs to be executed.
They can be triggered on:

- an event (using the inngest client)
- delayed executeion (using a timestamp)

### event driven

Call:

```
await inngest.send({
  name: #event-name,
  data: { # sendt as JSON
    id: #an id
    ...
  }
})
```

Function:

```
export default inngest.createFunction({
  id: #some description
  event: #the event
},
asynct({event, step} => {
  the code
})
)
```

### used functions
