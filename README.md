# LandProtect
Claim land in Minecraft and protect it with this powerful Minecraft plugin for Bukkit servers written in JavaScript thanks to ScriptCraft.

# How to claim land
Place a sing and type a name between two # signs. Like this: **#my House Name#**  
You can use spaces and use the 4 lines of the sing. Click **"Done"**  
From that very first moment, your land will be yours and no one else will be able to break any block, open any chest or grief in anyway(lava, water, etc.) without your permission.

# How to abandon land
Place a sign inside your claimed land, and type **#abandon#**.  
The land will be free again.

# How to rename your land name
Place again a sign inside your claimed land and type another name, like this: **#New House Name#**

# How to share your land with other players.
Add player to your chunk doing: **/chunkadd PlayerName** while standing inside the chunk you want to share.  
This will grant editing permission on that property to that second player.  

You can delete his/her permission anytime with: **/landkick PlayerName**

# Installation
LandProtect uses **ScriptCraft**, a lightweight Minecraft plugin that works as a bridge for JavaScript to use the full Java Bukkit API.  
Download ScriptCraft from here: www.scriptcraftjs.org, ScriptCraft will generate its own folder where you can add your custom plugins, like LandProtect.  
Inside the ScriptCraft folder, go to **'plugins'** and paste landprotection.js in.

## Why Javascript?

Anything you can do in a Bukkit Minecraft plugin using Java can now be done using JavaScript.  
**It just works with way less number of lines and it is definitely easier to read and write than Java.**  
ScriptCraft compiles your JavaScript code to its optimized equivalent Java.
ScriptCraft plugins don't get compiled to .jar to work, letting you easily edit the code and improve it directly making it easier to mantain it through any text editor. You can refresh changes without reloading or restarting typing **/js refresh()** at the console or at the chat as admin.  
