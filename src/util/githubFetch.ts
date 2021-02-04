import { IFiles } from "smooshpack"

export const fetchProjectFromGitHub = async () => {
  const accessToken = prompt("Enter your GitHub access token")
  const repoUrl = `https://api.github.com/repos/ionic-team/ionic-react-conference-app/git/trees/93cd376cc3f4a2867dfd2c748f56acaaf8155943?recursive=1?access_token=${accessToken}`
  const fileObject: IFiles = {}
  if (!accessToken) return
  try {
    const data = await fetch(repoUrl)
    const { tree } = await data.json()
    for (const { url, path } of tree) {
      const data = await fetch(`${url}?access_token=${accessToken}`)

      const { content } = await data.json()
      if (content) {
        const fileContent = atob(content)
        console.log(".")

        fileObject[`/${path}`] = { code: fileContent }
      }
    }
    return fileObject
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
