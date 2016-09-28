<html>
<body onload="fun()">
<script>
function fun()
{
<?php
echo "The time is " . date("h:i:sa");
?>
setInterval(function {fun(),1000});
}
</script>
</body>
</html>