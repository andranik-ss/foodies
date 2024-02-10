const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
const FOODIES_FOLDER_ID = '1gmeQsGaJKl-qRnSoIGjXa0aA87OVn7fJ'

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

async function getDriveService() {
  const auth = await authorize()
  return google.drive({ version: 'v3', auth })
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient })
  const res = await drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id, name)',
  })
  const files = res.data.files
  if (files.length === 0) {
    console.log('No files found.')
    return
  }

  console.log('Files:')
  files.map(file => {
    console.log(`${file.name} (${file.id})`)
  })
}

export async function uploadImage(image: File) {
  const service = await getDriveService()

  const bufferedImage = await image.arrayBuffer()

  try {
    const file = await service.files.create({
      requestBody: {
        name: image.name,
        fields: 'id',
        parents: [FOODIES_FOLDER_ID],
      },
      media: {
        mimeType: image.type,
        body: Buffer.from(bufferedImage),
      },
    })
    console.log('File Id:', file.data.id)
    return file.data.id
  } catch (err) {
    // TODO(developer) - Handle error
    throw err
  }
}
