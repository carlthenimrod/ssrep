<div class="sr-ctn" id="sr-admin">
	<article id="sr-login">
		<section id="sr-form">
			<p>Please Login Below!</p>
			
			<?php if( validation_errors() ) : ?>
				<div class="sr-error">
					<?= validation_errors(); ?>
				</div><!-- .sr-error -->
			<?php endif; ?>

			<form method="POST" action="<?= current_url(); ?>">
				<div>
					<label for="email">Email:</label>

					<input type="email" id="email" autofocus="autofocus" name="email" value="<?= set_value('email'); ?>" />
				</div>

				<div>
					<label for="password">Password:</label>

					<input type="password" id="password" name="password" />
				</div>

				<button type="submit">Login</button>
			</form>
		</section><!-- #sr-form -->
	</article><!-- #sr-login -->
</div><!-- .sr-ctn#sr-admin -->