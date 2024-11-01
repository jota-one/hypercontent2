#!/bin/bash
./pb/pocketbase serve & PB_PID=$!
echo $PB_PID
sleep 2
kill -9 $PB_PID
