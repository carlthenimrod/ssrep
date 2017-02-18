<div id="sr-tags">
	<section id="sr-create">
		<form>
			<label for="sr-tag-name">New Tag:</label>

			<input type="text" id="sr-tag-name" name="sr-tag-name" />

			<button type="submit">Add</button>
		</form>
	</section><!-- #sr-create -->

	<section id="sr-manage">
		<?php if( $tags ) : ?>
			<table>
				<tr>
					<th colspan="2">Tag Info</th>

					<th colspan="2">Actions</th>
				</tr>

				<?php foreach( $tags as $t ) : ?>
					<tr class="sr-tag" data-id="<?= $t->id; ?>">
						<td>
							<span><?= $t->name; ?></span>

							<img src="<?= base_url('assets/img/edit.png'); ?>" class="sr-edit" alt="Edit" title="Edit" />
						</td>

						<td></td>

						<td></td>

						<td>
							<img src="<?= base_url('assets/img/delete.png'); ?>" class="sr-delete" alt="Delete" title="Delete" />
						</td>
					</tr><!-- .sr-tag -->
				<?php endforeach; ?>
			</table>
		<?php else : ?>
			<p>No Tags - Add Some?</p>
		<?php endif; ?>
	</section><!-- #sr-manage -->
</div><!-- #sr-tags -->