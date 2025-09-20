#!/bin/bash
url='http://localhost:3000/api/greetings'
attempts=0
timeout=5
online=false

cont="y"
while [ "$cont" = "y" ];
do
    echo "Attempt: $attempts"
    code=`curl -sL --connect-timeout 20 --max-time 30 -w "%{http_code}\\n" "$url" -o /dev/null`
    echo "Found code $code for $url."

    if [[ "$attempts" -gt "20" ]]
        then
            echo "Attempts $attempts exceeded. => FAILURE"
            break
        fi

    if [ "$code" = "200" ]; then
        echo "Website $url is online => SUCCESS"
        break
    else
        sleep $timeout
    fi

    attempts=$(( $attempts + 1 ))
done
