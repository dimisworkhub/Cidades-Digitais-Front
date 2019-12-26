function deletar(item) {
	return fetch("/read/usuario/deleteuser", {
	  method: 'delete'
	})
	.then(response => response.json());
  }

 /* essa função faz uma tabela definida...só preciso que funcione em go, não PHP
 <table>
	<tbody>
		<tr>
			<th>Name</th>
			<th>Race</th>
		</tr>
		<?php foreach ($characters as $character) : ?>
        <tr>
            <td> <?php echo $character->name; ?> </td>
            <td> <?php echo $character->race; ?> </td>
        </tr>
		<?php endforeach; ?>
	</tbody>
</table>
 */