//LandProtect version 2.0
var alldata = scload('serverdb.json');
//setting database objects if unexistent:
if (alldata == undefined) {
    alldata = {};
    alldata.chunks = {};
    scsave(alldata, 'serverdb.json');
}

function claimSign(event) {
    var player = event.getPlayer();
    var playerUUID = player.uniqueId;
    var specialCharacter = "*";
    var lines = event.getLines();
    var signText = lines[0] + lines[1] + lines[2] + lines[3];
    var chunk = event.getBlock().getWorld().getChunkAt(event.getBlock().getLocation()); //get the chunck the sign is on.
    var x = chunk.getX();
    var z = chunk.getZ();

    var buyProperty = function(cx, cz, name, claimer) {
        alldata.chunks["x:" + cx + "z:" + cz] = {};
        alldata.chunks["x:" + cx + "z:" + cz].name = name;
        alldata.chunks["x:" + cx + "z:" + cz].owner = claimer.uniqueId.toString();
        alldata.chunks["x:" + cx + "z:" + cz].friends = [];
        scsave(alldata, 'serverdb.json');
        echo(claimer, "Congratulations, you are now the owner of ".green() + name + "!")
    }

    if (signText.length() > 0 && signText.substring(0, 1).equals(specialCharacter) && signText.substring(signText.length() - 1).equals(specialCharacter)) {
        var name = signText.substring(1, signText.length() - 1);
        if (name != "abandon") {
            if (alldata.chunks["x:" + x + "z:" + z] === undefined) {
                buyProperty(x, z, name, player);
            } else {
                if (alldata.chunks["x:" + x + "z:" + z].owner == player.uniqueId.toString()) {
                    alldata.chunks["x:" + x + "z:" + z].name = name;
                    scsave(alldata, 'serverdb.json');
                    echo(player, "You renamed this land to " + name + ".");
                }
            }
        } else {
            if (alldata.chunks["x:" + x + "z:" + z] === undefined) {
                echo(player, "You can't name your claim 'abandon'. You do that when you want to abandon claimed land.".red())
            } else {
                alldata.chunks["x:" + x + "z:" + z] = undefined;
                scsave(alldata, 'serverdb.json');
                echo(player, "You abandoned this chunk.".yellow());
            }
        }
    }
}

var canBuild = function(location, player) {
    var x = location.getChunk().getX();
    var z = location.getChunk().getZ();
    if (player.isOp()) { //Op players like admins can build anywhere
        return true;
    } else {
        if (alldata.chunks["x:" + x + "z:" + z] == undefined) { //if no one owns it
            return true;
        } else {
            if (location.getWorld().getEnvironment().equals(org.bukkit.World.Environment.NORMAL) && alldata.chunks["x:" + x + "z:" + z].owner == player.uniqueId) { // you can only build in the normal world
                return true;
            } else { //if it is a friend who has been granted building permission, return true.
                var friends = alldata.chunks["x:" + x + "z:" + z].friends
                for (var i = 0; i < friends.length; i++) { //A way a came up with to check if the player is in your friends list (an array for that property only).
                    if (friends[i] == player.uniqueId) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
}

// Anti-griefing functions:
var onInteract = function(event) {
    var b = event.getClickedBlock();
    var p = event.getPlayer();
    if (b != null) {
        if (!canBuild(b.getLocation(), event.getPlayer())) {
            event.setCancelled(true);
            echo(p, "You don't have permission to do that in private property!".red());
        }
    }
}
var onBukkitFill = function(event) {
    var p = event.getPlayer();
    if (!canBuild(p.getLocation(), event.getPlayer())) {
        echo(p, "You don't have permission to do that in private property!".red());
        event.setCancelled(true);
    }
}
var onBukkitEmpty = function(event) {
    var p = event.getPlayer();
    if (!canBuild(event.getBlockClicked().getLocation(), event.getPlayer())) {
        echo(p, "You don't have permission to do that in private property!".red());
        event.setCancelled(true);
    }
}

var showPropertyName = function(event) {
    var player = event.getPlayer();
    var worldName = event.getFrom().getWorld().getName();
    var fromChunk = event.getFrom().getChunk();
    var toChunck = event.getTo().getChunk();
    if (!worldName.endsWith("_nether") && !worldName.endsWith("_end") && fromChunk != toChunck) {
        // announce new area
        var x1 = fromChunk.getX();
        var z1 = fromChunk.getZ();

        var x2 = toChunck.getX();
        var z2 = toChunck.getZ();

        var name1 = alldata.chunks["x:" + x1 + "z:" + z1] !== undefined ? alldata.chunks["x:" + x1 + "z:" + z1].name : "the wilderness";
        var name2 = alldata.chunks["x:" + x2 + "z:" + z2] !== undefined ? alldata.chunks["x:" + x2 + "z:" + z2].name : "the wilderness";
        //name 1 is the fromChunk, name2 is the toChunk
        if (name1 == null) name1 = "the wilderness";
        if (name2 == null) name2 = "the wilderness";

        if (!name1.equals(name2)) {
            if (name2.equals("the wilderness")) {
                echo(player, "".gray() + "[ " + name2 + " ]");
            } else {
                echo(player, "".yellow() + "[ " + name2 + " ]");
            }
        } else {
            if (alldata.chunks["x:" + x2 + "z:" + z2] !== undefined) {
                echo(player, "".yellow() + "[ " + name2 + " ]");
            } else {
                echo(player, "".gray() + "[ " + name2 + " ]");
            }
        }
    }
}
//commands
commando('landadd', function(args, player) {
    var host = player;
    var x = host.getLocation().getChunk().getX();
    var z = host.getLocation().getChunk().getZ();
    var chunk = alldata.chunks["x:" + x + "z:" + z]
    var isChunkOwner = chunk == undefined ? false : chunk.owner == host.uniqueId ? true : false;

    if (isChunkOwner) {
        var guest = org.bukkit.Bukkit.getServer().getPlayer(args[0]);
        if (guest != null && host != guest) {
            var friends = alldata.chunks["x:" + x + "z:" + z].friends;
            friends.push(guest.uniqueId.toString());
            scsave(alldata, "serverdb.json");
            echo(host, "You have given building permission to ".green() + guest.name + " on your chunk '" + chunk.name + "'.");
            echo(guest, "You have been given permission to build on '".green() + chunk.name + "', property of " + host.name + ".");
        } else {
            echo(host, "That player was not found.")
        }
    } else {
        echo(host, "You do not own this chunk.".red())
    }
});
commando('landkick', function(args, player) {
    var host = player;
    var x = host.getLocation().getChunk().getX();
    var z = host.getLocation().getChunk().getZ();
    var friends = alldata.chunks["x:" + x + "z:" + z].friends;
    var chunk = alldata.chunks["x:" + x + "z:" + z];
    var isChunkOwner = chunk == undefined ? false : chunk.owner == host.uniqueId ? true : false;
    var playertoKick = org.bukkit.Bukkit.getServer().getPlayer(args[0]);
    if (isChunkOwner) {
        if (playertoKick != null && host != playertoKick) {
            for (var i = 0; i < friends.length; i++) {
                if (friends[i] == playertoKick.uniqueId) {
                    friends[i] = undefined;
                    scsave(alldata, "serverdb.json");
                    echo(host, "You removed building permission to ".yellow() + playertoKick.name + "!");

                } else {
                    if (i == friends.length - 1) {
                        echo(host, "That player didn't have building permission.");
                    }
                }
            }
        } else {
            echo(host, "That friend was not found in the server.");
        }
    } else {
        echo(host, "You don't own this chunk.".red());
    }
});

events.signChange(claimSign);
events.playerBucketEmpty(onBukkitEmpty);
events.playerBucketFill(onBukkitFill);
events.playerInteract(onInteract);
events.playerMove(showPropertyName);
