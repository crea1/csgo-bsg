#!/usr/bin/env bash

keyfile="deploy_key.pem"

echo "Starting deployment"

# These are defined in travis-ci environment variables
#echo "$username"
#echo "$server"
#echo "$server_path"

echo "Getting private key from environment variables"
echo -e "$private_key" > $keyfile
chmod 600 ${keyfile}


echo "Setting ssh environment variables"
eval "$(ssh-agent -s)";

echo "Adding private key to ssh-agent"
ssh-add ${keyfile};

echo "Transferring files with rsync"
rsync -r --delete-after --quiet -avz -e "ssh -i ${keyfile}" ${TRAVIS_BUILD_DIR}/dist/ ${username}@${server}:${server_path};
if [ $? != 0 ]; then
    echo "ERROR: Rsync feilet!"
    exit 1
fi


echo "Remove private key"
rm -f ${keyfile}

echo "Deployment finished! Huzzah!"
